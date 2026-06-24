#!/usr/bin/env node
// pregen-webp.mjs — QuirkyPromo 图片迁移 / Trends 试点
// 扫 SRC_DIR(扁平),为每张产品原图生成 w160/w400/w900 的 webp。
// 幂等:目标已存在且比原图新则跳过。坏图记日志不中断。
// 用法:
//   cd C:\Users\jilin\Desktop\promohub\_migrate
//   npm i sharp
//   node pregen-webp.mjs            # 正式跑
//   node pregen-webp.mjs --dry      # 只看会做什么,不写文件
//
// 输出布局(和 R2 桶规范一致,保持相对路径,方便 rclone 整目录上传):
//   _migrate/trends/products/<name>.<ext>                      <- 原图(不动)
//   _migrate/trends/products/_variants/w160/<name>.webp
//   _migrate/trends/products/_variants/w400/<name>.webp
//   _migrate/trends/products/_variants/w900/<name>.webp

import { readdir, stat, mkdir, writeFile, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// ---- 配置 ----
const SRC_DIR = path.resolve('./trends/products');          // 扁平原图目录
const VARIANT_ROOT = path.join(SRC_DIR, '_variants');        // 变体根
const WIDTHS = [160, 400, 900];
const WEBP_QUALITY = 78;                                     // 视觉无损区间,缩量明显
const SRC_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']); // 只处理位图;矢量/PDF 不在此目录,也不该来
const LOG = path.resolve('./pregen-webp.log');
const DRY = process.argv.includes('--dry');

const stamp = () => new Date().toISOString();
async function logLine(s) {
  const line = `[${stamp()}] ${s}\n`;
  process.stdout.write(line);
  if (!DRY) await appendFile(LOG, line);
}

// 目标是否“已是最新”:存在且 mtime >= 原图 mtime
async function isFresh(target, srcMtimeMs) {
  if (!existsSync(target)) return false;
  try { return (await stat(target)).mtimeMs >= srcMtimeMs; }
  catch { return false; }
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    await logLine(`FATAL 找不到原图目录: ${SRC_DIR}（请在 _migrate 目录下运行)`);
    process.exit(1);
  }

  const entries = await readdir(SRC_DIR, { withFileTypes: true });
  const files = entries
    .filter(e => e.isFile())
    .map(e => e.name)
    .filter(n => SRC_EXT.has(path.extname(n).toLowerCase()));

  await logLine(`扫描 ${SRC_DIR}: ${files.length} 张候选位图 (${DRY ? 'DRY-RUN' : '正式'})`);

  // 重名检测:扁平 + 单一 _variants → <name>(去扩展名)必须唯一,否则 webp 互相覆盖
  const byStem = new Map();
  for (const f of files) {
    const stem = path.basename(f, path.extname(f));
    if (!byStem.has(stem)) byStem.set(stem, []);
    byStem.get(stem).push(f);
  }
  const collisions = [...byStem.entries()].filter(([, arr]) => arr.length > 1);
  if (collisions.length) {
    await logLine(`!! 检测到 ${collisions.length} 组同名 stem 冲突,会导致 webp 互相覆盖,先处理这些再跑:`);
    for (const [stem, arr] of collisions) await logLine(`   冲突 stem="${stem}": ${arr.join(' , ')}`);
    await logLine(`已中止(未生成任何文件)。请重命名/去重后重试。`);
    process.exit(2);
  }

  if (!DRY) for (const w of WIDTHS) await mkdir(path.join(VARIANT_ROOT, `w${w}`), { recursive: true });

  let made = 0, skipped = 0, failed = 0;
  for (const name of files) {
    const srcPath = path.join(SRC_DIR, name);
    const stem = path.basename(name, path.extname(name));
    let srcMtimeMs = 0;
    try { srcMtimeMs = (await stat(srcPath)).mtimeMs; } catch {}

    for (const w of WIDTHS) {
      const outPath = path.join(VARIANT_ROOT, `w${w}`, `${stem}.webp`);
      if (await isFresh(outPath, srcMtimeMs)) { skipped++; continue; }
      if (DRY) { await logLine(`DRY 将生成 ${path.relative(SRC_DIR, outPath)}`); made++; continue; }
      try {
        const buf = await sharp(srcPath, { failOn: 'error' })
          .resize({ width: w, withoutEnlargement: true })   // 不放大,小图保持原宽
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();
        await writeFile(outPath, buf);
        made++;
      } catch (err) {
        failed++;
        await logLine(`FAIL ${name} @w${w}: ${err.message}`);
      }
    }
  }

  await logLine(`完成: 生成 ${made}, 跳过(已最新) ${skipped}, 失败 ${failed}.`);
  if (failed) await logLine(`有 ${failed} 个失败,见日志 FAIL 行,处理后重跑会幂等补齐。`);
}

main().catch(async e => { await logLine(`UNCAUGHT ${e.stack || e}`); process.exit(1); });

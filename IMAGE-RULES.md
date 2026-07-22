# QuirkyPromo 图片处理规范（API 导入参照）

> 适用于：所有供应商产品导入（PromoBrands / Trends / AS Colour / Gildan Brands / Logoline / Intex）
> 最后更新：2026-07-16

---

## 一、核心：双表机制

图片数据分存两处，**各司其职，不能混**：

| 表.字段 | 类型 | 用途 | 前端表现 |
|---|---|---|---|
| `products.colours` | jsonb 数组 | **色块 + 点色换主图** | "Choose Product Colour" 那排小方块 |
| `product_colours.images` | jsonb 字符串数组 | **画廊轮播** | 产品页图片轮播（第0张=主图） |

### 1.1 products.colours（色块）

```json
[
  {"name": "Black", "hex": "", "image": "https://pub-.../w400/ps4306-black.webp"},
  {"name": "Navy",  "hex": "", "image": "https://pub-.../w400/ps4306-navy.webp"}
]
```

字段说明：
- `name` — 颜色显示名（客户看到的）
- `image` — 该颜色的产品图 URL（w400）
- `hex` — 色值（如 `#000000`）

**⚠️ 硬规则：image 和 hex 二选一，不能同时填**
- **有分色图** → `image` 填 URL，`hex` 留空 → 前端显示彩色产品图缩略图
- **无分色图** → `image` 留空，`hex` 填色值 → 前端显示纯色圆圈
- `image` 有值时 `hex` **不会显示**，填了也白填

### 1.2 product_colours.images（画廊）

```json
[
  "https://pub-.../w400/ps4306-main.webp",
  "https://pub-.../w400/ps4306-ft1.webp",
  "https://pub-.../w400/ps4306-ft2.webp"
]
```

**⚠️ 硬规则：**
- **数组第 0 张 = 主图**（产品页大图、列表页缩略图都用它）
- 换主图 = **把目标图移到第 0 位**（不是替换第0张）
- 画廊只放**展示图**（角度图 / 模特图 / 细节图 / 印刷示意图）
- **不要把每个颜色的正面图都塞进画廊** —— 否则一个产品几十张图，页面加载很慢
  - 反面教材：AS Colour 5001 曾经画廊 83 张（77 个颜色图 + 6 张角度图），改成只放 6 张角度图后正常

---

## 二、色块图的选取规则

按产品实际情况分四种：

| 情况 | 色块 image | 色块 hex | 说明 |
|---|---|---|---|
| 有分色图 | 该颜色的图 | 空 | 最理想 |
| **单色产品**，只有主图 | **用主图** | 空 | 如 Intex PS4102 Natural 帆布袋 |
| **多色产品但无分色图**（主图是多色合影） | 空 | 填 HEX | 客户能看出色差，如 Intex FOLB01 8色 |
| 定制品（全彩印刷/客户自选色） | 空 | 空 | 颜色名填 `Custom`，前端显定制说明 |
| 无颜色选项（双材质/默认配色） | 空 | 空 | 颜色名填 `Default` |

**判断口诀**：
- 有图就用图
- 单色没分色图 → 用主图
- 多色没分色图 → 用 HEX 圆圈
- 定制/无色选 → Custom / Default（无图无hex）

---

## 三、R2 路径规律（各供应商不同）

**统一域名**：`https://pub-fbec7c9199f04af8ab95a413a4620d37.r2.dev`

**统一前缀**：`/suppliers/<供应商>/products/_variants/`

**三个尺寸**：`w160`（色块缩略图）/ `w400`（色块+主图，**默认用这个**）/ `w900`（大图）

| 供应商 | 路径结构 | 示例 |
|---|---|---|
| **AS Colour** | `w400/<sku>/<文件名>.webp` | `.../w400/5001/5001-staple-tee-black.webp` |
| **Gildan** | `w400/<sku>/<文件名>.webp` | `.../w400/2000/2000-black-front.webp` |
| **Intex** | `w400/<sku小写>/<文件名>.webp` | `.../w400/ps4306/ps4306-black.webp` |
| **Trends** | `w400/<产品码>-<序号>.webp`（**扁平，无子目录**） | `.../w400/129665-1.webp` |
| **PromoBrands** | `w400/branded\|unbranded/<sku>/<文件名>.webp` | `.../w400/branded/h907/h907_bd_1.webp` |

### 文件名转换规则（原图 → R2）
```
原图文件名 → 全小写 → 非字母数字转横杠 → 扩展名改 .webp

PS4306-LIGHT BLUE.jpg  →  ps4306-light-blue.webp
5001_STAPLE_TEE_BLACK.jpg → 5001-staple-tee-black.webp
```

---

## 四、导入流程（顺序不能乱）

```
1. 图传 R2（预生成 3 尺寸 webp → rclone copy）
        ↓
2. 抽查 URL 能打开 + 颜色对得上   ← 不能跳过
        ↓
3. 生成 colours / images 映射
        ↓
4. API 导入（products.colours + product_colours.images）
        ↓
5. 导入后自检 SQL（见第五节）
        ↓
6. 前台抽查几个产品
```

**⚠️ 第 2 步和第 5 步都不能省。** 血泪史：
- Trends 129580 主图指向 `-2`，但那张图根本不存在 → 前台占位图
- Trends 129665 颜色错位一格（White 显示成黄杯）
- AS Colour 4525 主图源文件损坏没传上，URL 404

---

## 五、导入后自检 SQL（必跑）

```sql
-- 1. 画廊为空/null 的（最坏情况，产品没图）
SELECT p.supplier_sku, p.name
FROM products p
LEFT JOIN product_colours pc ON pc.product_id = p.id
WHERE p.supplier = '<供应商>'
  AND (pc.images IS NULL OR jsonb_array_length(pc.images) = 0);
-- 期望：0 行

-- 2. 色块既无图又无 hex（会显示灰块）
SELECT supplier_sku, name
FROM products
WHERE supplier = '<供应商>'
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(colours) e
    WHERE (e->>'image' IS NULL OR e->>'image' = '')
      AND (e->>'hex' IS NULL OR e->>'hex' = '')
      AND e->>'name' NOT IN ('Custom','Default')
  );
-- 期望：0 行（Custom/Default 除外，它们本来就无图无hex）

-- 3. 图片地址还指向 Cloudinary（旧数据没迁）
SELECT COUNT(*) FROM products p
JOIN product_colours pc ON pc.product_id = p.id
WHERE p.supplier = '<供应商>' AND pc.images::text ILIKE '%cloudinary%';
-- 期望：0

-- 4. 色块无颜色（colours 为空数组或 null）
SELECT supplier_sku, name FROM products
WHERE supplier = '<供应商>'
  AND (colours IS NULL OR jsonb_array_length(colours) = 0);
-- 期望：0 行

-- 5. 抽查一个产品的完整结构
SELECT p.supplier_sku, p.name,
  jsonb_pretty(p.colours) AS 色块,
  (SELECT jsonb_pretty(pc.images) FROM product_colours pc WHERE pc.product_id = p.id) AS 画廊
FROM products p
WHERE p.supplier = '<供应商>' AND p.supplier_sku = '<某个SKU>';
```

---

## 六、常用维护 SQL

### 6.1 换主图（把某张图移到画廊第 0 位）

```sql
UPDATE product_colours pc SET images =
  ('["<目标图URL>"]'::jsonb ||
   COALESCE((SELECT jsonb_agg(e) FROM jsonb_array_elements_text(pc.images) e
             WHERE e <> '<目标图URL>'), '[]'::jsonb))
FROM products p
WHERE pc.product_id = p.id AND p.supplier = '<供应商>' AND p.supplier_code = '<SKU>';
```

**⚠️ 一定要 `COALESCE(..., '[]'::jsonb)`** —— 否则去重后为空会把整个数组变成 null。

### 6.2 批量把 bd_1 提为主图（PromoBrands 专用）

```sql
UPDATE product_colours pc SET images =
  (SELECT jsonb_agg(e ORDER BY (e NOT ILIKE '%bd_1.webp%'), ord)
   FROM jsonb_array_elements_text(pc.images) WITH ORDINALITY AS t(e, ord))
FROM products p
WHERE pc.product_id = p.id AND p.supplier = 'PromoBrands'
  AND p.supplier_code IN ('SKU1','SKU2',...);
```

### 6.3 从画廊删掉某类图（如颜色单色图）

```sql
UPDATE product_colours pc SET images = (
  SELECT jsonb_agg(e ORDER BY ord)
  FROM jsonb_array_elements_text(pc.images) WITH ORDINALITY AS t(e, ord)
  WHERE e NOT LIKE '%\_ub\_%' ESCAPE '\'
)
FROM products p
WHERE pc.product_id = p.id AND p.supplier = 'PromoBrands'
  AND pc.images::text LIKE '%\_bd\_%' ESCAPE '\'   -- 安全网：必须有 bd 图才删 ub
  AND pc.images::text LIKE '%\_ub\_%' ESCAPE '\';
```

### 6.4 查色块缺图的产品（jsonb 查询，不能用 LIKE）

```sql
SELECT supplier_code, name FROM products
WHERE supplier = '<供应商>'
  AND EXISTS (SELECT 1 FROM jsonb_array_elements(colours) e
              WHERE e->>'image' = '' OR e->>'image' IS NULL);
```

---

## 七、踩过的坑（务必避免）

| # | 坑 | 后果 | 对策 |
|---|---|---|---|
| 1 | **`ILIKE '%_ub_%'` 里的下划线是通配符** | 误匹配一大堆无关图，统计全错 | 用 `LIKE '%\_ub\_%' ESCAPE '\'` |
| 2 | 换主图用拼接子查询没加 COALESCE | 画廊变 null，产品没图 | 一定加 `COALESCE(..., '[]'::jsonb)` |
| 3 | 画廊 UPDATE 带 `AND pc.images IS NOT NULL` | null 行永远匹配不上，改不到 | 去掉这个条件 |
| 4 | 源图文件名**混用横杠和下划线** | 扫描漏图（Trends 漏了 298 张） | 正则用 `[-_]` 同时匹配 |
| 5 | 图片序号规律**每个产品不同** | 颜色错位（White 显示成黄色） | 逐个人工核对，不要自动反推 |
| 6 | `-0` / `-1` 有时是同一张图（IMPACT AWARE 版） | 主图重复 | 只取一张 |
| 7 | 源图损坏但没发现 | 传不上 R2 → URL 404 → 前台占位图 | 预生成时看 ERR 日志 + 导入后跑自检 |
| 8 | 大批量 SQL 没备份 | 改错无法回滚 | **备份 SQL 永远放最前面** |
| 9 | 大批量前没先测单个 | 一次搞坏几百条 | 先在 1 个产品上验证再批量 |
| 10 | 只看"能不能打开"不看"颜色对不对" | 图能开但配错色 | 打开后确认黑色URL真是黑色 |

---

## 八、各供应商图片来源规律（备忘）

| 供应商 | 分色图 | 主图 | 画廊 |
|---|---|---|---|
| **AS Colour** | 款号主文件夹的纯颜色图（`5001_STAPLE_TEE_BLACK`） | MODEL_SHOTS 里的 MAIN | MODEL_SHOTS 角度图（FRONT/BACK/SIDE/TURN） |
| **Gildan** | Flat Lay 的 `_Front` 平铺图 | 同上 | E-commerce 模特图前 1-2 张 |
| **Intex** | `<SKU>-<颜色>.jpg` | `<SKU>-MAIN.jpg` | MAIN + FT 角度图 + DECO 印刷示意图（DECO 排最后） |
| **Trends** | `<码>-<序号>`，序号**每个产品不同**，需逐个核对 | 通常 `-0`（有时 `-1`/`-2`） | 颜色图之后的序号 |
| **PromoBrands** | `unbranded/<sku>/<sku>_ub_<色>` | `branded/<sku>/<sku>_bd_1` | branded 图（bd_1~bd_n）+ lifestyle/img 展示图 |

### PromoBrands 主图优先级
```
lifestyle-* > branded-<数字> > img_* > main > <sku>_bd_1
（都必须是不带颜色名前缀的展示图）
```

### 非颜色词（提取颜色时要剔除）
```
FRONT / BACK / SIDE / MAIN / TURN / DETAIL / MODEL / LIFESTYLE / LOGO / DECO / FT<数字>
COPY / EDIT / SHOPPED / PHOTOSHOPPED / GROUP / HANGING / CIRCLE / EXTRA
Other colours on request / Indent colours / All colours available / Multi-Colour
```

---

## 九、快速检查清单（导入前后各过一遍）

**导入前：**
- [ ] 图已传 R2，rclone 显示 100%
- [ ] 抽查 3-5 个 URL 能打开
- [ ] **抽查的图颜色和文件名对得上**（黑色URL是黑色）
- [ ] 映射文件里每个 image URL 都对应真实存在的文件
- [ ] 色块 image / hex 没有同时填或同时空（Custom/Default 除外）

**导入后：**
- [ ] 跑第五节的 5 条自检 SQL，全部符合期望
- [ ] 前台打开 3-5 个产品，色块能点、主图会换、画廊能翻
- [ ] 检查单色产品、多色产品、Custom 产品各一个

---

## 十、现成的映射文件（可直接喂 API）

| 供应商 | 文件 | 内容 |
|---|---|---|
| Intex（392款） | `intex_r2_mapping.json` | main / colours[{colour,image,image_w160,hex}] / gallery |
| | `intex_r2_colours.csv` | product_code, colour, image_url, hex |
| | `intex_r2_galleries.csv` | product_code, main, gallery_urls |
| Trends 新品（58款） | `trends58_mapping.json` | main / colours / gallery / category / subcategory |
| | `trends58_colours.csv` | product_code, colour, image_url |
| | `trends58_galleries.csv` | product_code, main, gallery_count, gallery_urls |
| AS Colour（443款） | `ascolour_r2_mapping.json` | main / colours / gallery |
| Gildan（89款） | `gildan_r2_mapping.json` | main / colours[含hex] / gallery |

这些文件里的 URL **都已验证过真实存在**，可直接使用。

# 需求:全站 Meta 体检 + AS 产品 meta 模板升级(交数据线)· 2026-07-05

> 运营线出的 SQL 草稿。⚠ **跑之前先核对实际字段名/表名**(依据 A6:products 有 `seo_description`/`meta_description`;GSM 可能在 `specs` jsonb 里——以实际 schema 为准)。UPDATE 先跑 SELECT 预览,确认无误再执行。

## 1. 体检(只读,先跑这个)

```sql
-- 1a. meta 缺失统计:按 supplier 分组
SELECT supplier,
       COUNT(*) AS total,
       COUNT(*) FILTER (WHERE COALESCE(meta_description,'') = '') AS missing_meta,
       COUNT(*) FILTER (WHERE COALESCE(seo_description,'') = '') AS missing_seo
FROM products
WHERE is_published = true
GROUP BY supplier ORDER BY total DESC;

-- 1b. 重复 meta(boilerplate 检测):同一句 meta 被多少产品共用
SELECT meta_description, COUNT(*) AS n
FROM products
WHERE is_published = true AND COALESCE(meta_description,'') <> ''
GROUP BY meta_description HAVING COUNT(*) > 5
ORDER BY n DESC LIMIT 20;

-- 1c. url_pages(类目/落地页)meta 缺失清单
SELECT slug, title
FROM url_pages
WHERE COALESCE(meta_description,'') = '';
```

结果三张表贴回运营线。

## 2. AS 产品 meta 模板升级(UPDATE,谨慎)

**现模板(弱)**:`Print your logo on the {name} — {gsm} GSM. Screen Print/DTG/DTF/Embroidery from 20.`
**新模板**:`Custom print the {name} ({gsm} GSM) with your logo — screen print, DTG, DTF or embroidery. From 20 units, free digital proof, fast Australia-wide delivery.`

```sql
-- 2a. 先预览(把 GSM 取值路径换成实际的,如 specs jsonb)
SELECT name,
  'Custom print the ' || name || ' (' || {GSM取值} || ' GSM) with your logo — screen print, DTG, DTF or embroidery. From 20 units, free digital proof, fast Australia-wide delivery.' AS new_meta,
  LENGTH(...) AS len   -- 控制在 165 字符内,超长的单独处理
FROM products
WHERE supplier = 'ascolour' AND is_published = true
LIMIT 20;

-- 2b. 预览没问题后再 UPDATE(同 WHERE 条件,只动 AS,别碰 TRENDS/PB/LOGOLINE 的手写 meta)
```

**注意**:① 只更新 AS(其他供应商 meta 是逐条写的,质量高,别覆盖);② 产品名含 "®" 等字符,注意转义;③ 个别产品没有 GSM 值的,fallback 成不带括号的版本;④ 印刷方式如果各产品不同,从 `print_methods` 拼,别写死四种。

## 3. 规则(运营线定,登记备查)
- 产品页 meta = 模板化,但模板必须含:参数 + MOQ 单位 + 钩子(free proof / Australia-wide)
- 类目/落地页 meta = 运营逐条手写(随深化文案一起交付)
- 新供应商上线前,meta 模板先过运营线(进 SEO pipeline 检查单)
```

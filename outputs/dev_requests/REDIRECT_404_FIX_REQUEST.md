# 需求:945 个 404 旧 URL 的 301/410 处理(交开发线)· 2026-07-05

**背景**:GSC "Not found (404)" 945 页,占 Not indexed 的 83%。GSC 导出样本分析,旧 URL 分三类(样本在 GSC 可导出,规律如下)。趋势已自然下降(4月 ~4K → 现 945),但做重定向能接住残余权重、加速清理。

## 规律与处理规则

### A. 旧嵌套产品 URL(主体,约大半)
格式:`/category/<...任意层级...>/<product-slug>`
例:`/category/main-category/search-result/tuscany-wine-gift-box-double-trendz`、`/category/outdoor-sports/bbq-sets/entertainer-bbq-set`、`/category/main-category/search/vintage-baseball-cap`
**规则(动态判断,建议 middleware / catch-all 实现)**:
1. 取路径**最后一段**当作 slug 查 `products`(`is_published=true`)→ 命中:**301 → `/products/<slug>`**
2. 未命中产品,但路径中段能映射到现有类目(查 `url_pages`)→ **301 → 对应扁平类目页**
3. 都不命中 → **410 Gone**(明确告诉 Google 永久没了,比 404 清得快)

### B. 远古 PHP URL
格式:`/promo/www/product/productlist.php?category=...&page=...`
**规则:全部 410 Gone**(无对应关系,不做 301;别甩首页,会被判 soft-404)

### C. 零星
- `/site` → 410(或 301 首页,二选一)
- `/products/<已下架产品slug>`(如 `/products/knitwear`)→ 有替代类目就 301 到类目,没有就 410

## 红线
- ❌ **禁止把对不上的旧 URL 统一 301 到首页**(soft-404,反而伤信任)
- 301 目标必须是内容相关页(同产品 > 同类目 > 410)

## 验收
- 抽 10 个 GSC 样本 URL 逐个访问:A 类命中产品的 301 到对应 PDP;B 类返回 410
- 部署后运营在 GSC 对 "Not found (404)" 点 **Validate Fix**,4–6 周观察该数字下降

**参考**:完整 945 条清单 = GSC → Pages → Not found (404) → Export(运营已导出,需要可给)

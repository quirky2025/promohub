# 需求:更新 sitemap 覆盖全部已发布产品(交开发线)· 2026-07-05(恢复重建)

> 状态:开发线已实现动态生成 ✅,运营已在 GSC 重提交。留档备查。

**背景**:GSC sitemap 状态 Success 但只有 **2,827 URLs**(TRENDS 上线时生成);产品约 **6,000**,PromoBrands/LOGOLINE 等后续上线的不在 sitemap 里。

**要求**
1. **首选方案:sitemap 改为动态生成**(从 DB 实时出,Next.js sitemap 路由读 `products` + `url_pages`),上新品自动进。✅ 已实现
2. **收录规则**(与现有 SEO 基建一致):
   - 只含 `is_published = true` 的产品 canonical URL;
   - 颜色变体页维持现有 noindex + canonical 合并规则,**不进 sitemap**;
   - 类目/子类目/集合页按 `url_pages` 表的扁平 URL 收入;
   - AS Colour 441 款当前 `is_published=false`,发布后自动纳入。
3. 如 URL 总数大,拆 **sitemap index**(products / categories / collections 分文件),单文件 <50,000。
4. 上线后运营在 GSC 重新提交并核对 Discovered URLs ≈ 已发布页面数(开发报 4,700+)。

**验收**:GSC sitemap Discovered URLs 与已发布产品+页面数量级一致;无 noindex 页混入。

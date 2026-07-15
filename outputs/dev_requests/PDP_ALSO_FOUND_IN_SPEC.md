# 需求:产品页 "Also Found In" 内链块(交开发线)· 2026-07-13

**目的**:每个 PDP 自动生成一组指向其所属集合页的链接。给落地页导内链权重 + 帮 Google 理解站点结构 + 用户交叉发现。竞品(美国站)已验证此模式。

## 规则
1. **位置**:PDP specs 区下方(或 Similar Products 上方),标题 "Also found in"。
2. **链接来源(按产品字段自动匹配,只链已上线且可索引的页面)**:
   - 子类目页(category/subcategory → url_pages)
   - 颜色集合页(colours jsonb ∩ 已存在的颜色集合页,如 black-promotional-pens)
   - Eco 集合(material_tags/eco 标 → /sustainability 或对应 eco 子类)
   - 品牌页(brand 有值且品牌页存在,如 Bic)
   - 场景集合页(产品被人工挂进的 collection,如 Trade Show Giveaways —— 上线后自动出现)
3. **数量上限 6–8 个**,优先级:场景 > 颜色 > 子类 > 品牌(场景页最需要内链)。
4. **必须过滤**:未上线页面、noindex 页、空集合(<4 个产品的集合不链)。
5. 样式:小链接 chip 一行排,别抢 Get a Quote 的戏。

## 验收
- 任一笔类 PDP 显示合理的 4–8 个链接,全部 200 状态、可索引页。
- Trade Show 落地页上线后,挂进该 collection 的产品 PDP 自动出现其链接。

## 优先级
中——建议排在 Pens 三页文案上线之后、Trade Show 落地页上线之前(它是 LP 的输血管)。
来源:Lily 2026-07-13 从竞品 PDP 观察提出。

# 落地页(LP)+ Filter + Also-Found-In 架构 & 执行路线图 · 2026-07-13

**目标**:复刻 QLP 那套"产品从多个维度被发现"的体系 —— 每个属性都有落地页(LP),PDP 用 "Also Found In" 把它们全链出来。内链成网 → SEO 权重流动 + 用户交叉发现。
**适用**:先在 Pens 跑通,再复制到全站。

---

## 一、六类落地页(LP)

| # | LP 类型 | 例子 | 靠什么喂产品 | 引擎状态 |
|---|---|---|---|---|
| 1 | **类型**(子分类) | Ballpoint / Stylus / Novelty Pens | `subcategory` 主分类 | ✅ 已有 |
| 2 | **材料** | Metal / Bamboo Pens | material 过滤(material_tags) | ⚠️ 需加 `material` filter 类型 |
| 3 | **机制** | Retractable Pens | pen_mechanism 过滤 | ⚠️ 需加 `mechanism` filter 类型 |
| 4 | **品牌** | Bic / Moleskine / Swiss Peak(全站级) | `brand` 过滤 | ⚠️ 需加 `brand` filter 类型 |
| 5 | **颜色** | Black / Blue Pens | colour_slugs 过滤 | ✅ 已有(colour_category) |
| 6 | **集合** | Pen Gift Sets / Trade Show | extra_subcategories 标签 | ✅ 已有(collection) |

> 每类 LP = 一条 `url_pages` 记录(product_filter 指定类型)+ 一段 SEO 文案 + 可选导航入口。核心页面代码(app/[slug]/page.js)已通吃这些 filter 类型,不用重写。

## 二、Also-Found-In(PDP 内链块)

PDP 底部自动列出该产品所属的所有 LP,**按维度**:
- 所在**子分类**(类型)
- 所有命中的**颜色** LP
- 所在**材料** LP
- 所在**机制** LP(如 Retractable)
- **品牌** LP(brand 有值时)← Lily 补充
- 被人工挂入的**集合**(Pen Gift Sets、Trade Show…)

规则(见 `PDP_ALSO_FOUND_IN_SPEC.md`):只链已上线+可索引+非空(<4 个产品不链)的 LP;上限 6–8;优先级 集合>颜色>类型>品牌。

---

## 三、已定的分类学决策(数据说话的结果)

- **保留**类型子分类:Ballpoint / Stylus / Highlighter / Pencil(+ Eco Pens / Pen Presentation / Pen Gift Sets)。
- **新增**子分类:**Novelty Pens**(Mop Top、Banner 等造型笔)。
- **退掉**伪子分类:`Metal Pens`(7)、`Plastic Pens`(3)—— 它们是材料不是类型 → 改成**材料 LP**(显示全部金属/塑料笔,不再是 7/3)。
- **不拆** Gel(6)/Rollerball(10)/Fineliner(11):量太小,留在 Ballpoint,靠 filter 筛(数据依据:v2 探针)。
- **品牌是全站级**:Swiss Peak/Pierre Cardin/Moleskine 跨品类 → 品牌 LP = "Shop by Brand",不只是笔。

## 四、数据前提(LP/filter 要准,数据得齐)

| 数据 | 状态 | 备注 |
|---|---|---|
| `brand` 回填 | ✅ 已跑(LAMY/Moleskine/Swiss Peak/Pierre Cardin;Bic 原有) | Cross 待人工挑(crossbody 误报) |
| `material_tags` | ❓ 待查齐(ABS→Plastic 已在 filter 端修) | 材料 LP 依赖 |
| `pen_mechanism` | ❓ 待查齐 | Retractable LP 依赖 |
| `colour_slugs` | ✅ 已有 | 颜色 LP 依赖 |
| `extra_subcategories` | ✅(Pen Gift Sets 已用) | 集合 LP 依赖 |

## 五、执行顺序(建议)

**第 0 步 · 先上线已完成的**(不等):
- Pens 深化文案 + Pen Gift Sets 子类 + 4 个 filter 修正(ABS/Recycled Alu/隐藏 Intex/Under $1)+ brand 回填。

**第 1 步 · 补引擎(小代码)**:给 applyProductFilter 加 `brand` / `material` / `mechanism` 三个 filter 类型(仿 `collection`,各几行)。

**第 2 步 · Novelty Pens 子类**:找造型笔(Mop Top/Banner…)→ 建子类(移动 or 交叉挂)+ 导航 + 文案。

**第 3 步 · 首批 LP 上线**(精选高价值词,≥15 产品 + 真搜索量):
- 机制:Retractable Pens(105)
- 材料:Metal Pens、Bamboo Pens、Plastic Pens
- 品牌:Bic、Swiss Peak、Moleskine、Pierre Cardin、LAMY(全站级)
- 每个 = url_pages 入口 + 文案(照 pens_page_copy 结构)。

**第 4 步 · Also-Found-In**(PDP 内链块):按 `PDP_ALSO_FOUND_IN_SPEC.md` 实现,把上面所有 LP 在 PDP 链出来(含品牌链接)。这是把整张网络串起来的最后一环。

**第 5 步 · 复制到全站**:Pens 跑通后,Drinkware/Bags/… 照此办理。

## 六、SEO 红线(不可越)

- LP 只做**真有搜索量 + 产品数够(≥ ~15)**的,避免薄内容/门口页(doorway pages)被 Google 扣分。
- 不承诺未核实的交期(红线)。
- Also-Found-In 只链非空、可索引页。

---
**当前进度**:引擎已有 collection + colour;brand 数据已回填;Pens 文案/Gift Sets/filter 修正待 push。下一步从"第 0 步上线 + 第 1 步补三个 filter 类型"开始。

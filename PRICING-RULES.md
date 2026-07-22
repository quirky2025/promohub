# QuirkyPromo 定价与 Setup 规则(唯一参考)

> 姊妹文档:图片处理规范见根目录 **`IMAGE-RULES.md`**(双表机制 / R2 三尺寸路径 / 导入自检 SQL / 踩坑清单)。API 导入产品时两份都要读。

> 目的:API 导入产品、报价、核价时的定价标准。
> **代码里唯一数据源是 `lib/pricing.js`(硬货)和 `lib/decorationPricing.js`(服装印刷)。**
> 导入脚本/报价页一律**从这两个文件读**,不要另写一套数字,否则两边打架。
> 最后更新:2026-07-22。

---

## 1. 加价(Margin)—— 售价怎么从进货价算出来

API 给的是**进货价(成本)**,上架卖价按下面规则算。全部先算 **ex-GST**,整单最后再加 10% GST。

### 1.1 产品基础价(阶梯毛利)

`lib/pricing.js` → `tierMargin(index)`

| 数量档位置 | 倍率 | 毛利 |
|---|---|---|
| 第 1 档(最小起订量) | × **1.50** | 50% |
| 第 2 档 | × **1.45** | 45% |
| 第 3 档起 | × **1.40** | 40% |

- 只作用在**产品 / 服装基础价**上。
- 产品单价**不做取整**。

### 1.2 印刷 / 装饰单价

`lib/pricing.js` → `decoUnitPrice(perUnit)`

- 客户印刷单价 = **进货价 × 1.40**,**向上取整到 $0.10**。
- 永远不低于成本。

### 1.3 其他固定项

| 项目 | 规则 | 代码 |
|---|---|---|
| GST | 全澳 10%,整单最后加 | `GST = 0.10` |
| 运费 | **$25 / 每产品 / 每收货地址**(产品数 × 地址数) | `SHIPPING = 25` |
| 生产周期 | 3–7 个工作日(Trends 标准) | `LEAD_TIME` |

---

## 2. 按供应商分三桶 —— 定价 / 版费不一样,别混

**这是最容易搞错的地方。定价规则取决于产品来自哪个供应商,不是笼统"硬货 vs 服装"。**
setup 一律按保本收,不乘 margin("只要不亏就好")。

| 桶 | 供应商 | 基础价 | 印刷单价 | Setup / 版费 | 走哪套代码 |
|---|---|---|---|---|---|
| **① 普通产品** | **Trends / PromoBrands(PB)/ Logoline**,以及所有硬货(笔/杯/袋…)。**即使是服装(帽子/卫衣/T恤)也算这桶** | §1.1 阶梯毛利 | 供应商 API 自带 decoration options × 1.40,取整到 $0.10 | **固定 $60**(`SETUP_FEE`) | `lib/pricing.js` |
| **② AS Colour** | **只有 AS Colour**(`decoration_model='calculator'`) | 空白衫 base × margin | `decorationPricing.js` 的印刷价表(按方式/尺寸/数量/位置) | **按方式和位置变**(见 §2.2) | `lib/decorationPricing.js` |
| **③ Gildan** | **只有 Gildan** | ⚠ **待定** | ⚠ **待定** | ⚠ **待定** | ⚠ **尚未进系统** |

> **⚠ 重点(Lily 2026-07-22):**
> - **Gildan ≠ AS Colour。** 两家的服装定价不一样,不能合并处理。
> - **Gildan 目前在代码里完全没有实现**(`grep gildan` 零结果)。要上 Gildan,必须先由 Lily 给出:空白衫基础价怎么算、印刷单价表、版费规则。填进 §2.3 后再启用。
> - **API 导入(Trends / PB)一律走桶 ①**,含它们家的服装,setup 固定 $60。**不要**给导入的服装套 AS Colour 那套计算器价。

### 2.1 桶① 普通产品

`lib/pricing.js` → `SETUP_FEE = 60`

- 基础价:§1.1 阶梯毛利(1.50 / 1.45 / 1.40)。
- 印刷:用供应商自带的 decoration options,单价 ×1.40 取整到 $0.10。
- Setup:**固定 $60**,不乘 margin。
- Trends / PB / Logoline 的**服装也在这桶**(帽子、卫衣、T恤等)。

### 2.2 桶② AS Colour —— setup 按方式和位置变

`lib/decorationPricing.js` —— **仅 AS Colour**。setup 不是固定 60:

| 印刷方式 | Setup 费 |
|---|---|
| **Screen Print(网印)** | 按颜色数:1色 $60 / 2色 $120 / 3色 $180 / 4色 $240 / 5色 $300 / 6色 $360 / 7色 $420 / **8色 $400**,再 **× 位置数** |
| **DTG** | **$60 × 位置数** |
| **Embroidery(刺绣)** | **$60 × 位置数**(每个位置单独打版 digitizing) |
| **DTF** | **$0**(不收版费) |
| **DTF(帽子)** | **$0** |

- 网印 8 色 = **$400**(不是 8×$60),照 AS Colour 实际版费表。
- 网印深底 / 涤纶底:每个位置 **+$1**(计入成本,随 margin)。

**AS Colour 印刷单价表(节选,详见 `decorationPricing.js`):**

- **Screen Print**:按 颜色数(1–8)× 数量档 × 位置。数量档:20/26/50/125/250/500/1000/2500/5000。
- **DTG**:按 底色(白/深)× 尺寸(A4 / 35×40 / 40×50)× 数量。
- **DTF**:按 尺寸(S/M/L/XL)× 数量,**无版费**。
- **Embroidery**:小尺寸(≤12×12)有价;中尺寸(12–20cm)= **POA 询价**。

### 2.3 桶③ Gildan —— ⚠ 待 Lily 提供,尚未实现

Gildan 和 AS Colour 是两套。上线前需要 Lily 明确:

1. **空白衫基础价** 怎么定(× 什么倍率 / 阶梯?)。
2. **印刷单价** —— 和 AS Colour 用同一个印刷厂(那印刷价一样、只是空白衫价不同)?还是 Gildan 自己一套印刷价表?
3. **版费** 规则。

在这三点填清楚、代码里建好 Gildan 分支之前,**不要把 Gildan 产品当 AS Colour 报价**。

### 2.4 收尾 / 履约 add-on(保本价,客户价 ×1.40)

`FINISHING`:Swing tag $0.50、Apply barcode $0.50、Fold & bag $1.50、Individually bagged $0.30(单价,保本)。

---

## 3. API 导入产品时怎么套用

1. **先分供应商,再分类型**(Lily 2026-07-22 修订):
   - **Trends / PromoBrands / Logoline 的一切产品(含服装)**:一律按硬货处理——基础价 §1.1 阶梯毛利,印刷用供应商 API 里的印刷方式(单价 ×1.40 取整到 $0.10),setup §2.1 固定 $60。
   - **AS Colour / Gildan(计算器供应商)**:才走 §2.2 的按方式/位置 setup 和服装印刷价表。API 导入不涉及这两家。
2. **导入脚本不要自己造定价数字** —— 调用现有函数:
   `tierMargin()`、`decoUnitPrice()`、`SETUP_FEE`、`SHIPPING`、`GST`(硬货);
   `quoteDecoration()` / `quoteJob()`(服装印刷)。
3. **类目映射**:PB 原类目 → 我们的类目,右边一栏必须用**前台真实在用的 ~20 个主类目**
   (Bags / Drinkware / Apparel / Technology / Home & Living / Headwear / Pens 等,以导航菜单为准),
   **不要**映射到已隐藏的历史类目(Business / Print / Personal / Promotion / Promotional / Leisure)。
   详见 `HANDOVER-CATEGORIES.md` 第 2 节。

---

## 4. 相关代码文件

| 文件 | 管什么 |
|---|---|
| `lib/pricing.js` | 硬货:margin、阶梯毛利、$60 setup、运费、GST、印刷单价取整 |
| `lib/decorationPricing.js` | 服装:各印刷方式单价表、按方式/位置的 setup、起步价、finishing |

**改价只改这两个文件。** 任何页面/脚本都从这里 import,不硬编码数字。

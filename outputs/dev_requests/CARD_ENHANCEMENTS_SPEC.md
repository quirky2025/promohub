# 需求:产品卡增强(借鉴 QLP)· 2026-07-13

来源:Lily 通读 Quality Logo Products 的 Retractable 子类页,按投入产出挑出可借鉴项。
适用:所有列表页卡片(`components/CategoryFilter.jsx` 的 ProductCard + `app/[slug]/page.js` 的 ProductCard,两处一致)。

## 🟢 立即可做(数据就绪)

### 1. 卡片加 "See it with your logo" 链接
- **动机**:把 free proof 陈列出来 —— 好奇心 → 上传 logo → 进询盘漏斗。目前卡片只有价格+MOQ,缺这一勾子。
- **实现**:卡片底部加一行小链接 "See it with your logo →"。点击 → 进该产品 PDP(PDP 已有 logo 上传 + Get a Quote 弹窗),或直接触发 `QuoteButton`(source='card',带产品上下文)。
- **数据**:现成。低成本。
- **样式**:小字金色链接,别抢主视觉。

### 2. 卡片显示 "+N more colours"
- **动机**:提高点击欲,展示可选颜色丰富度。
- **实现**:卡片已渲染前若干个色块(`_swatches`);若颜色总数 > 已显示数,追加文字 "+N more"。N = 总色数 − 已展示色块数。
- **数据**:现成(`product._swatches` / `colour_slugs`)。一行逻辑。

## 🟡 有前提

### 3. "Best Seller" 角标
- **动机**:真实热销打标,提可信度(非假紧迫,红线安全)。
- **⚠️ 前提(阻塞)**:products 表**当前无** best-seller / 销量字段。二选一:
  - (a) 加 `is_bestseller boolean` 列,人工/运营标记;或
  - (b) 从订单/询盘数据(order_count / quote_count 已有于客户侧)聚合算出 top N,回填标记。
- **实现**(有字段后):卡片左上角红/金角标 "Best Seller"(复用现有 ECO 角标的位置逻辑,注意别和 ECO 叠)。
- **定位**:等数据源就绪再做。

## 🔴 不做 / 以后

- **交付日期承诺("Get It By …")**:红线明确"未核实不承诺交期"+ 标准品库存不稳 → 不碰。
- **Budget 计算器 filter**:聪明但开发量大 → backlog。
- **"Price includes decoration" 定价展示**:与我们"setup 单列"透明模式冲突 → 不改,我们的更好。

## 验收
- 任一列表页卡片显示 "See it with your logo" 链接(点击进 PDP/询价)+ 颜色数 >展示数时显示 "+N more"。
- Best Seller 待数据源就绪后另行验收。

---
**关联记录:** "custom retractable pens" 机制类子类页 —— filter 里 Retractable 有 105 款,建新子类 LP,进关键词表 **P3** 排队(与 Pens 三页文案、Also-Found-In、Trade Show LP 一并排期)。

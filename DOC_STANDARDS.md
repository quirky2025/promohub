# QuirkyPromo — 单据/表单统一标准 (Document Standards)

> **任何新表单(PDF)先看这一份。** 已遵守:Quote · Order Confirmation · Tax Invoice · Purchase Order(4 种业务单据抬头必须逐字一致)。
> Artwork Proof / Certificate 布局可不同,但 logo + 品牌色一致。
> 页面:A4 595 × 842 pt。

## 1. 颜色
- NAVY `#1B2A4A` = rgb(0.106, 0.165, 0.290)
- GOLD `#C9A96E` = rgb(0.788, 0.663, 0.431)
- **浅底文字一律纯黑 rgb(0.08, 0.08, 0.08) —— 绝不用灰。** 生成器里 `GREY` 常量直接 = 黑(从根上,别每处单独改)。
- navy(深)底上的字用白。

## 2. 统一抬头 Header band(4 种业务单据逐字一致)
- navy 横条:`x:0, y:H-110, width:满, height:110`。
- **礼盒图 logo** `public/quirky-logo-quote.png`:`x:40, y:H-42, width:150, height:150*256/1400`(≈27.4)。
  加载:`fs.readFileSync(process.cwd()/public/quirky-logo-quote.png)` + 兜底 `fetch('https://www.quirkypromo.com.au/quirky-logo-quote.png')`。
- 联系块(左):ABN / Phone / Email / Web,`x:40`,起点 `cy:H-64`,size **9**,标签 bold 白 + 值 reg 白,行距 **12**。
- **标题**(QUOTE / ORDER CONFIRMATION / TAX INVOICE / PURCHASE ORDER):**右对齐 `x:W-40, y:H-35, size:18` bold 白(与 logo 垂直居中对齐)。统一 18,不得比 logo 大。**
- **Meta**(单号/日期/页码等):标签**左对齐 `x:392`** size 9 bold 白;值**右对齐 `W-40`** size 9 reg 白;行距 12,起点 `y:H-60`。

## 3. 金额
- 一律 `'$' + Number(n).toLocaleString('en-AU',{minimumFractionDigits:2,maximumFractionDigits:2})` → **$1,234.00**(千分位 + 两位小数)。

## 4. 编号
- 客户 = **`OC{YY}{NNNN}`**(下单生成,印在 OC / 发票 / 订单号)。
- 供应商采购单 = **`PO{YY}{NNNN}`**。
- **SP 弃用;客户单绝不用 PO 前缀。** 老数据保留原号(不迁移)。

## 5. 正文约定
- 商品明细表头:**Stock Code | Description | Qty | Unit | Total**(列名用 `Stock Code`,不用 `Code`)。
- 分隔/合计线**不得压字**:line 的 y = 文字 baseline + ~12 以上。
- 采购单 **DELIVER TO**:公司名(粗)+ `Attn:` 收件人 + `Phone:` + 地址(常为**客户**地址)。区块标题(DELIVER TO / JOB)大号黑体,内容小一号。

## 6. 生成器位置
| 单据 | 文件 |
|---|---|
| Order Confirmation / Tax Invoice | `lib/orderDocPdf.js`(docType 切换) |
| Purchase Order | `lib/poDocPdf.js` |
| Quote | `app/api/quote/route.js`(内联) |
| Artwork Proof | `lib/proofGen.js` |
| Certificate of Approval | `lib/certGen.js` |

## 7. 新表单检查清单
- [ ] navy 110 抬头 + 礼盒图 logo(宽 150)
- [ ] 标题右对齐 `W-40, H-44, size 18` 白
- [ ] meta:标签 `x:392` 左对齐 / 值 `W-40` 右对齐,size 9
- [ ] 浅底字**全黑,无灰**
- [ ] 金额**千分位** + 两位小数
- [ ] 正确编号前缀(客户 OC / 供应商 PO)
- [ ] 分隔线**不压字**

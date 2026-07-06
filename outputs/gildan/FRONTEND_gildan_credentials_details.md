# 前端 spec — Gildan:Credentials + Product Details(给前端线)

改 `ASColourClient`(AS + 计算器产品共用那个)。AS 已经有「Description tab 三栏:左 Features+Credentials / 中 Product Details / 右 Description」的版式(见 AS 产品页)。本次:**让 Gildan Brands 产品也填满这三栏**,并补 Gildan 的认证 logo。只影响 `supplier==='Gildan Brands'`,AS 不变。

---

## 1) Credentials(Gildan Brands 三家通用,固定 4 个 logo)

当 `product.supplier === 'Gildan Brands'`,在 Description tab 左栏(Features 下面,和 AS 的 Credentials 同位置)显示这 4 个 logo。图已放好在 `public/credentials/`:

| 图 src | alt |
|---|---|
| `/credentials/standard100.png` | OEKO-TEX Standard 100 |
| `/credentials/wrap.png` | WRAP Certified |
| `/credentials/sedex.png` | Sedex Member |
| `/credentials/fairlabor.png` | Fair Labor Association |

三家(Gildan / Comfort Colors / American Apparel)都显示这同一套 —— 品牌级统一,**不需要每个产品存数据,按 supplier 固定即可**。

参考写法(嵌到现有 Credentials 区,样式对齐 AS 的那组灰度 logo):
```jsx
const GILDAN_CREDS = [
  { src: '/credentials/standard100.png', alt: 'OEKO-TEX Standard 100' },
  { src: '/credentials/wrap.png',        alt: 'WRAP Certified' },
  { src: '/credentials/sedex.png',       alt: 'Sedex Member' },
  { src: '/credentials/fairlabor.png',   alt: 'Fair Labor Association' },
];
{product.supplier === 'Gildan Brands' && (
  <div>
    <h4>Credentials</h4>
    <div style={{ display:'flex', gap:'16px', flexWrap:'wrap', alignItems:'center' }}>
      {GILDAN_CREDS.map(c => (
        <img key={c.src} src={c.src} alt={c.alt} style={{ height:'40px', width:'auto', objectFit:'contain' }} />
      ))}
    </div>
  </div>
)}
```
(高度/灰度按 AS 现有 Credentials 的样式统一即可。)

## 2) PRODUCT DETAILS 表(Gildan Brands)

数据都在 `product.specs`(jsonb)+ 固定 lead time。逐行渲染,**值为空的行隐藏**:

| 行 | 取值 |
|---|---|
| Material | `specs.composition` + (`specs.weight_gsm` ? ` · ${weight_gsm} GSM` : '') |
| Fit | `specs.fit` |
| Care | `specs.care`(Gildan 大多为空 → 空则整行隐藏) |
| Lead time | 固定 `7–10 business days (after artwork approval)` |

`specs` 实际形状(导入 SQL 里):`{"composition":"100% US Cotton","weight_gsm":"203","fit":"Classic Fit"}`。
Construction 行:Gildan 无单独字段 → **本期省略**(或以后从 features 里挑一条,不强求)。

样式套 AS 的 PRODUCT DETAILS 表(深色表头 + 两列 label/value)。

## 3) 删掉标题下那句(AS + Gildan 都删)

标题/起步价下面这句**删除**,所有计算器产品(AS + Gildan)都不再显示:
> ~~Blank garments are not sold — every order includes your logo.~~

在 `ASColourClient` 里把渲染这句的那行/那个块移除即可(AS、Gildan 共用组件,一处删两家都生效)。

---

## 验收
- Gildan 产品(如 1301)Description tab:左 Features + 4 个 Gildan logo、中 Material/Fit/Lead time 表、右 Description。
- AS 产品**零变化**(仍是 amfori/vegan/UPF50 + 它自己的 Product Details)。
- 标题下 "Blank garments are not sold…" 两家都在。

// lib/financeAccounts.js
// QuirkyPromo chart of accounts (科目表). Single source of truth for the bank
// ledger category dropdown AND the automatic P&L. Add / rename here only.
//
// section drives the P&L:
//   revenue  → 收入
//   cogs     → 销货成本 (Revenue − COGS = 毛利 Gross profit)
//   overhead → 管理/运营费用 (毛利 − Overhead = 净利 Net profit)
//   other    → 不进利润表 (期初余额 / 转账 / BAS缴税 / 股东往来)
// dir is the normal money direction, used to pre-select the form.

export const ACCOUNTS = [
  // ── 收入 Revenue ─────────────────────────────────────────────
  { code: 'sales_local',        label: '销售收入 · 本地备货',   section: 'revenue', dir: 'in' },
  { code: 'sales_sourcing',     label: '销售收入 · Sourcing',   section: 'revenue', dir: 'in' },
  { code: 'other_income',       label: '其他收入',              section: 'revenue', dir: 'in' },

  // ── 销货成本 COGS ────────────────────────────────────────────
  { code: 'cogs_goods',         label: '货款 · 工厂/供应商',     section: 'cogs', dir: 'out' },
  { code: 'cogs_intl_freight',  label: '国际运费 · 货代',        section: 'cogs', dir: 'out' },
  { code: 'cogs_local_freight', label: '本地快递/运费',          section: 'cogs', dir: 'out' },
  { code: 'cogs_duty',          label: '关税 / 清关',           section: 'cogs', dir: 'out' },
  { code: 'cogs_decoration',    label: '印刷 / 加工',           section: 'cogs', dir: 'out' },

  // ── 管理/运营费用 Overhead ──────────────────────────────────
  { code: 'ovh_phone_internet', label: '话费 / 网络',           section: 'overhead', dir: 'out' },
  { code: 'ovh_office',         label: '办公费用',              section: 'overhead', dir: 'out' },
  { code: 'ovh_software',       label: '软件 / 订阅',           section: 'overhead', dir: 'out' },
  { code: 'ovh_bank_fees',      label: '银行 / 支付手续费',      section: 'overhead', dir: 'out' },
  { code: 'ovh_wages',          label: '工资 / 薪酬',           section: 'overhead', dir: 'out' },
  { code: 'ovh_rent',           label: '租金',                 section: 'overhead', dir: 'out' },
  { code: 'ovh_marketing',      label: '广告 / 营销',           section: 'overhead', dir: 'out' },
  { code: 'ovh_insurance',      label: '保险',                 section: 'overhead', dir: 'out' },
  { code: 'ovh_other',          label: '其他费用',              section: 'overhead', dir: 'out' },

  // ── 不进利润表 Other (资产负债 / 往来) ───────────────────────
  { code: 'opening_balance',    label: '期初余额',              section: 'other', dir: 'in' },
  { code: 'transfer',           label: '账户转账',              section: 'other', dir: 'out' },
  { code: 'gst_remittance',     label: 'BAS / GST 缴税',        section: 'other', dir: 'out' },
  { code: 'owner_contribution', label: '股东投入',              section: 'other', dir: 'in' },
  { code: 'owner_drawing',      label: '股东支取',              section: 'other', dir: 'out' },
];

export const ACCOUNT_BY_CODE = Object.fromEntries(ACCOUNTS.map((a) => [a.code, a]));

export const SECTION_LABEL = {
  revenue: '收入',
  cogs: '销货成本',
  overhead: '管理 / 运营费用',
  other: '不计入利润表',
};

// section for a category code (defaults to 'other' for unknown / legacy free-text)
export function sectionOf(code) {
  return ACCOUNT_BY_CODE[code]?.section || 'other';
}

// grouped { revenue:[...], cogs:[...], overhead:[...], other:[...] } for the dropdown
export function accountsBySection() {
  const g = { revenue: [], cogs: [], overhead: [], other: [] };
  for (const a of ACCOUNTS) (g[a.section] = g[a.section] || []).push(a);
  return g;
}

// lib/decorationPricing.js
// AS Colour / Made-In 印刷算价 · 唯一数据源(源自 decoration_pricing.json,已内联)
// 客户价规则:per-unit = Made-In × MARGIN;setup = 保本价(不乘 margin,"只要不亏就好")。
// setup 口径:网印 = $60×色×位;DTG / 刺绣 = $60×位(每位置单独打版);DTF = 0。
// 前端计算器与后台核价共用本文件 —— 改价只改这里。
// ⚠ 不要再并行维护 decoration_pricing.json(仅存档/生成用,不要 ship),否则两边打架。

export const DECORATION = {
  "margin": 1.4,
  "min_qty": 20,
  "product_type_methods": {
    "apparel": [
      "screen_print",
      "dtg",
      "dtf",
      "embroidery"
    ],
    "hats": [
      "dtf_hats",
      "embroidery"
    ],
    "bags": [
      "screen_print",
      "dtf",
      "embroidery"
    ]
  },
  "methods": {
    "screen_print": {
      "label": "Screen Print",
      "min_qty": 20,
      "qty_tiers": [
        20,
        26,
        50,
        125,
        250,
        500,
        1000,
        2500,
        5000
      ],
      "setup": 60,
      "priced_by": [
        "colours(1-8)",
        "quantity",
        "position"
      ],
      "max_size_cm": "35x45",
      "unit_price_per_colour_tier": {
        "1": [
          5.0,
          3.4,
          2.0,
          1.65,
          1.05,
          0.95,
          0.9,
          0.8,
          0.75
        ],
        "2": [
          6.0,
          3.9,
          2.35,
          1.9,
          1.25,
          1.01,
          0.96,
          0.84,
          0.79
        ],
        "3": [
          7.2,
          4.7,
          2.75,
          2.2,
          1.5,
          1.07,
          1.01,
          0.88,
          0.83
        ],
        "4": [
          8.65,
          5.6,
          3.25,
          2.5,
          1.8,
          1.14,
          1.07,
          0.92,
          0.87
        ],
        "5": [
          null,
          6.75,
          3.8,
          2.9,
          2.15,
          1.33,
          1.24,
          1.06,
          1.0
        ],
        "6": [
          null,
          8.1,
          4.5,
          3.35,
          2.6,
          1.42,
          1.3,
          1.09,
          1.03
        ],
        "7": [
          null,
          9.7,
          5.25,
          3.85,
          3.1,
          1.53,
          1.37,
          1.13,
          1.07
        ],
        "8": [
          null,
          11.65,
          6.2,
          4.45,
          3.75,
          1.65,
          1.45,
          1.18,
          1.12
        ]
      },
      "surcharges": {
        "fleece_per_unit": 0.5,
        "long_sleeve_per_sleeve": 0.5,
        "poly_or_dark_base_per_print": 1.0,
        "puff_metallic_specialty": "POA"
      }
    },
    "dtg": {
      "label": "DTG (Direct to Garment)",
      "min_qty": 20,
      "qty_tiers": [
        10,
        20,
        50,
        100
      ],
      "setup": 60,
      "priced_by": [
        "garment_colour(white/dark)",
        "print_size",
        "quantity"
      ],
      "max_size_cm": "40x50",
      "unit_price": {
        "white": {
          "A4": [
            8.9,
            6.0,
            5.5,
            4.9
          ],
          "35x40": [
            10.9,
            7.2,
            6.0,
            5.5
          ],
          "40x50": [
            12.9,
            8.9,
            7.9,
            6.9
          ]
        },
        "dark": {
          "A4": [
            10.9,
            8.5,
            7.8,
            7.2
          ],
          "35x40": [
            12.9,
            10.9,
            9.9,
            9.3
          ],
          "40x50": [
            14.9,
            13.9,
            12.9,
            11.9
          ]
        }
      },
      "sizes": [
        "A4",
        "35x40",
        "40x50"
      ],
      "size_options_cm": {
        "A4": "~21x30",
        "35x40": "35x40",
        "40x50": "40x50"
      }
    },
    "dtf": {
      "label": "DTF (Direct to Film)",
      "min_qty": 20,
      "qty_tiers": [
        20,
        50,
        100,
        200,
        500
      ],
      "setup": 0,
      "priced_by": [
        "size(S/M/L/XL)",
        "quantity"
      ],
      "max_size_cm": "35x40",
      "unit_price": {
        "small": [
          4.5,
          3.75,
          3.5,
          3.25,
          2.8
        ],
        "medium": [
          5.85,
          5.5,
          4.95,
          4.5,
          4.0
        ],
        "large": [
          9.25,
          8.75,
          7.25,
          6.75,
          6.25
        ],
        "xlarge": [
          12.5,
          11.75,
          9.25,
          8.75,
          8.25
        ]
      },
      "sizes": {
        "small": "12x12",
        "medium": "28x20",
        "large": "28x28",
        "xlarge": "35x40"
      }
    },
    "dtf_hats": {
      "label": "DTF (Hats)",
      "min_qty": 20,
      "qty_tiers": [
        20,
        50,
        100,
        200,
        500
      ],
      "setup": 0,
      "priced_by": [
        "quantity"
      ],
      "max_size_cm": "12x12",
      "unit_price": [
        6.0,
        5.0,
        4.5,
        4.0,
        3.5
      ]
    },
    "embroidery": {
      "label": "Embroidery",
      "min_qty": 20,
      "qty_tiers": [
        20,
        25,
        50,
        100,
        200
      ],
      "setup": 60,
      "priced_by": [
        "size",
        "quantity"
      ],
      "max_size_cm": "12x12",
      "sizes": {
        "small": {
          "dim": "<=12x12cm",
          "unit_price": [
            12.0,
            8.0,
            7.0,
            6.5,
            6.0
          ]
        },
        "medium": {
          "dim": "12-20cm",
          "unit_price": "POA"
        }
      },
      "size_options_cm": {
        "small": "<=12x12",
        "medium": "12-20 (POA)"
      }
    }
  }
};

export const MARGIN = DECORATION.margin;   // 1.4
export const MIN_QTY = DECORATION.min_qty; // 20

const round2 = (n) => Math.round(n * 100) / 100;

// 数量档索引:取「≤ qty 的最大档」。qty 低于首档 → 用首档(min_qty 另行校验)。
function tierIndex(tiers, qty) {
  let idx = 0;
  for (let i = 0; i < tiers.length; i++) {
    if (qty >= tiers[i]) idx = i;
  }
  return idx;
}

// 方法列表(按产品类型)。type ∈ apparel | hats | bags
export function methodsFor(type) {
  const keys = DECORATION.product_type_methods[type] || DECORATION.product_type_methods.apparel;
  return keys.map((k) => ({ key: k, label: DECORATION.methods[k].label }));
}

// 主计算。返回 { poa, perUnitMadeIn, perUnit, setup, tierQty, note }
//  perUnit = 客户每件印刷价(已×margin);setup = 客户一次性版费(保本,未×margin)
// 入参:
//  method   'screen_print'|'dtg'|'dtf'|'dtf_hats'|'embroidery'
//  colours  网印颜色数 1..8
//  positions 印刷位置数(per-unit 与 setup 都随位置)
//  qty      总件数
//  shade    dtg:'white'|'dark'(浅/深底)
//  sizeKey  dtf:'small|medium|large|xlarge';dtg:'A4|35x40|40x50';embroidery:'small|medium'
export function quoteDecoration({ method, colours = 1, positions = 1, qty = MIN_QTY, shade = 'white', sizeKey } = {}) {
  const m = DECORATION.methods[method];
  if (!m) return { poa: false, perUnitMadeIn: 0, perUnit: 0, setup: 0, tierQty: qty, note: 'unknown method' };
  const pos = Math.max(positions, 1);
  const ti = tierIndex(m.qty_tiers, qty);
  const tierQty = m.qty_tiers[ti];
  let made = null;
  let setup = 0;
  let poa = false;

  if (method === 'screen_print') {
    const nCol = Math.min(Math.max(colours, 1), 8);
    const row = m.unit_price_per_colour_tier[String(nCol)] || [];
    const base = row[ti];
    if (base == null) poa = true;                       // 低数量高色数无价 → POA
    else made = base * pos;                             // 每位置一版,per-unit 随位置线性
    setup = (m.setup || 60) * nCol * pos;               // $60×色×位
  } else if (method === 'dtg') {
    const table = m.unit_price[shade === 'dark' ? 'dark' : 'white'] || {};
    const arr = table[sizeKey] || table['A4'] || [];
    made = (arr[ti] != null ? arr[ti] : arr[arr.length - 1]) * pos;
    setup = (m.setup || 60) * pos;                      // artwork 打版:每位置一次
  } else if (method === 'dtf') {
    const arr = m.unit_price[sizeKey] || m.unit_price['small'] || [];
    made = (arr[ti] != null ? arr[ti] : arr[arr.length - 1]) * pos;
    setup = (m.setup || 0) * pos;                       // DTF 版费=0,乘位置仍 0(规则统一)
  } else if (method === 'dtf_hats') {
    const arr = m.unit_price || [];
    made = (arr[ti] != null ? arr[ti] : arr[arr.length - 1]) * pos;
    setup = 0;
  } else if (method === 'embroidery') {
    const sz = (m.sizes || {})[sizeKey || 'small'];
    if (!sz || sz.unit_price === 'POA' || !Array.isArray(sz.unit_price)) poa = true;
    else made = sz.unit_price[ti] * pos;
    setup = (m.setup || 60) * pos;                      // digitizing:每位置单独打版
  }

  if (poa || made == null) {
    return { poa: true, perUnitMadeIn: 0, perUnit: 0, setup: round2(setup), tierQty, note: 'POA — 请询价' };
  }
  return {
    poa: false,
    perUnitMadeIn: round2(made),
    perUnit: round2(made * MARGIN),
    setup: round2(setup),
    tierQty,
    note: '',
  };
}

// 整单印刷小计(不含服装):perUnit×qty + setup
export function decorationLineTotal(quote, qty) {
  if (!quote || quote.poa) return null;
  return round2(quote.perUnit * qty + quote.setup);
}

// ── 计算器产品"起步价"(客户价, ex-GST)──────────────────────────────
// from = 衣服零售(base×MARGIN) + 最便宜印刷方式单件价(1色/最小尺寸/单位置/最大数量档)。
// setup 不计入:走量时摊薄趋零,"as low as / from" 按量价报。
// ⚠ PDP "from $X" 与 page.js 传给 JSON-LD 的 offer 价都必须调这个函数(显示价=结构化价)。
export function startingUnitPrice(garmentBase, type = 'apparel') {
  const garment = (Number(garmentBase) || 0) * MARGIN;
  const methods = DECORATION.product_type_methods[type] || DECORATION.product_type_methods.apparel;
  let cheapest = Infinity;
  for (const key of methods) {
    const m = DECORATION.methods[key];
    if (!m) continue;
    const q = quoteDecoration({ method: key, colours: 1, positions: 1, qty: m.qty_tiers[m.qty_tiers.length - 1] });
    if (!q.poa && q.perUnit > 0 && q.perUnit < cheapest) cheapest = q.perUnit;
  }
  if (!Number.isFinite(cheapest)) return garment > 0 ? Math.round(garment * 100) / 100 : null;
  return Math.round((garment + cheapest) * 100) / 100;
}

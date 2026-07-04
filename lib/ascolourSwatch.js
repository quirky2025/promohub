// lib/ascolourSwatch.js
// AS Colour 颜色名 → 近似 hex(小圆点色块用)。
// 数据里颜色多为空 hex,故此表兜底;取色优先级见 getASHex 调用处:
//   colour.hex || getASHex(name) || getColourHex(name) || 默认灰。
// 说明:这些是近似值,点选后主图会换成该色的真实产品照片,故轻微色差不影响选色。
// 以后可用真实产品图采样(取衣服主色)替换,Gildan 亦可复用本表结构。

export const AS_SWATCH = {
  'Arctic Blue': '#6A9FD4', 'Army': '#4B5320', 'Atlantic': '#1F4E5F', 'Autumn': '#B5651D',
  'Berry': '#8E3B5E', 'Black': '#1A1A1A', 'Bone': '#E3DCCB', 'Bright Royal': '#2A4BD7',
  'Bubblegum': '#F4A6C0', 'Burgundy': '#6D1F2C', 'Butter': '#F3E5A3', 'Camel': '#C19A6B',
  'Cardinal': '#9B2226', 'Carolina Blue': '#9BC4E2', 'Charcoal': '#36454F', 'Charity Pink': '#F39AB5',
  'Charlotte': '#7FD3C9', 'Chestnut': '#4A2C2A', 'Citrus': '#B7D84B', 'Clay': '#A75D3F',
  'Coal': '#3A3A3A', 'Cobalt': '#1B3A8F', 'Cocoa': '#6F4E37', 'Copper': '#B87333',
  'Coral': '#E2725B', 'Cypress': '#4A5D3A', 'Dark Chocolate': '#3D2B1F', 'Ecru': '#D9CBB2',
  'Eucalyptus': '#6A8A7F', 'Fire': '#E2231A', 'Fog Blue': '#9FB4C4', 'Forest Green': '#1F4D2E',
  'Gold': '#E0A92E', 'Granite': '#8F8F8F', 'Grey Marle': '#B6B6B6', 'Hydro': '#4AA3C4',
  'Jade': '#2E8B6F', 'Kelly Green': '#3AA655', 'Khaki': '#B3A06B', 'Kiwi': '#8FB43A',
  'Lapis': '#3F5FB0', 'Lemonade': '#F4EA9A', 'Light Grey': '#CFCFCF', 'Lime': '#B7D84B',
  'Mauve': '#9A7B9A', 'Midnight Blue': '#17203F', 'Mineral': '#A9B0AA', 'Moss': '#6B7A3A',
  'Mushroom': '#B8A894', 'Mustard': '#D4A017', 'Natural': '#E8DFC8', 'Navy': '#1B2A4A',
  'Orange': '#E8791E', 'Orchid': '#C48FC4', 'Pale Blue': '#BCD4E6', 'Pale Pink': '#F3D4DC',
  'Petrol Blue': '#2F5A66', 'Pine Green': '#1F4A3A', 'Pink': '#F4A6C0', 'Pistachio': '#B7CC8F',
  'Plum': '#5A2A4A', 'Powder': '#DBE6EF', 'Purple': '#6A3FA0', 'Red': '#D8231F',
  'Safari': '#B7A06B', 'Sage': '#A9B89A', 'Sand': '#D8C9A3', 'Seafoam': '#A9E0CF',
  'Shadow': '#7A7A7A', 'Shadow6': '#6A6A6A', 'Slate Blue': '#5A6A8A', 'Smoke': '#B0B0B0',
  'Sunset': '#E8912E', 'Topaz': '#E0B93E', 'Walnut': '#5A4632', 'White': '#FFFFFF',
  'Yellow': '#F4D03F',
};

export function getASHex(name) {
  return (name && AS_SWATCH[name]) || '';
}

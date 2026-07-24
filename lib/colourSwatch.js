export const COLOUR_SWATCH = {
  'White': '#FFFFFF',
  'Black': '#1A1A1A',
  'Yellow': '#FFD400',
  'Orange': '#FF7A00',
  'Red': '#D62828',
  'Bright Green': '#3DBE29',
  'Dark Green': '#1B5E20',
  'Light Blue': '#7EC8E3',
  'Dark Blue': '#1F4E9C',
  'Navy': '#1B2A4A',
  'Grey': '#9E9E9E',
  'Heather Grey': '#B8B8B8',
  'Burgundy': '#7B1E3B',
  'Olive': '#6B6A2A',
  'Bottle Green': '#0B5345',
  'Teal': '#0F7E7E',
  'Slate Blue': '#5C6BC0',
  'Royal Blue': '#2E5BFF',
  'French Navy': '#22356F',
  'Carbon': '#3C3C3C',
  'Purple': '#7B2CBF',
  'Pink': '#F06292',
  'Green': '#2E8B57',
  // Lily 2026-07-23(Martini Pen/Vistro Pen 实测发现):字典缺常见促销品颜色词,导致这些
  // 颜色掉进"没有专属图"的兜底,显示跟颜色无关的主图/灰圈——补全常见的。
  'Silver': '#C7C9CB',
  'Clear': '#E8F4F8',
  'Gold': '#D4AF37',
  'Rose Gold': '#B76E79',
  'Cream': '#F5EFD7',
  'Beige': '#D9C7A3',
  'Sand': '#D8C39A',
  'Stone': '#B8AFA0',
  'Charcoal': '#3A3A3A',
  'Maroon': '#5C1A2E',
  'Brown': '#6B4423',
  'Lime': '#B7D833',
  'Turquoise': '#30D5C8',
  'Metallic Silver': '#C0C0C0',
  // Lily 2026-07-24(Jelly Cube Sensory Toy T530 实测发现):字典只有 Light Blue/Dark Blue/
  // Royal Blue 这些复合词,没有单独的 "Blue"——供应商产品颜色就叫纯 "Blue" 时库存表那颗
  // 颜色圆点直接不显示(其它颜色 Black/Red/Green 都有对应词条,只有 Blue 查不到)。补上。
  'Blue': '#1E5FBF',
};

export function getColourHex(name) {
  return (name && COLOUR_SWATCH[name]) || '';
}

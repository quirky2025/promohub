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
};

export function getColourHex(name) {
  return (name && COLOUR_SWATCH[name]) || '';
}

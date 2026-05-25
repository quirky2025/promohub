'use client';

import { useState } from 'react';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

const PMS_COLOURS = [
  { pms: 'PMS 100', hex: '#F6EB61', name: 'Yellow' },
  { pms: 'PMS 101', hex: '#F6E746', name: 'Yellow' },
  { pms: 'PMS 102', hex: '#FAE21B', name: 'Yellow' },
  { pms: 'PMS 103', hex: '#C6AD0F', name: 'Dark Yellow' },
  { pms: 'PMS 104', hex: '#B89B0A', name: 'Olive Yellow' },
  { pms: 'PMS 105', hex: '#90750A', name: 'Dark Olive' },
  { pms: 'PMS 106', hex: '#F7E741', name: 'Bright Yellow' },
  { pms: 'PMS 107', hex: '#FAE01E', name: 'Bright Yellow' },
  { pms: 'PMS 108', hex: '#FAD900', name: 'Yellow' },
  { pms: 'PMS 109', hex: '#F5CE00', name: 'Yellow' },
  { pms: 'PMS 110', hex: '#D4AA00', name: 'Golden Yellow' },
  { pms: 'PMS 111', hex: '#B38C00', name: 'Dark Gold' },
  { pms: 'PMS 112', hex: '#9C7800', name: 'Olive Gold' },
  { pms: 'PMS 113', hex: '#FAE272', name: 'Light Yellow' },
  { pms: 'PMS 114', hex: '#FAE05A', name: 'Light Yellow' },
  { pms: 'PMS 115', hex: '#FAD94A', name: 'Medium Yellow' },
  { pms: 'PMS 116', hex: '#FFCD00', name: 'Bright Yellow' },
  { pms: 'PMS 117', hex: '#C9A800', name: 'Gold' },
  { pms: 'PMS 118', hex: '#A88C00', name: 'Dark Gold' },
  { pms: 'PMS 119', hex: '#8C7200', name: 'Olive' },
  { pms: 'PMS 120', hex: '#FAE484', name: 'Pale Yellow' },
  { pms: 'PMS 121', hex: '#FAE070', name: 'Light Yellow' },
  { pms: 'PMS 122', hex: '#FAD85A', name: 'Yellow' },
  { pms: 'PMS 123', hex: '#FFC72C', name: 'Amber' },
  { pms: 'PMS 124', hex: '#E0A800', name: 'Dark Amber' },
  { pms: 'PMS 125', hex: '#B88C00', name: 'Bronze' },
  { pms: 'PMS 126', hex: '#9C7800', name: 'Dark Bronze' },
  { pms: 'PMS 127', hex: '#F5E484', name: 'Pale Yellow' },
  { pms: 'PMS 128', hex: '#F5E070', name: 'Light Yellow' },
  { pms: 'PMS 129', hex: '#F0D85A', name: 'Yellow' },
  { pms: 'PMS 130', hex: '#E8B400', name: 'Amber' },
  { pms: 'PMS 131', hex: '#C49600', name: 'Dark Amber' },
  { pms: 'PMS 132', hex: '#9C7800', name: 'Bronze' },
  { pms: 'PMS 133', hex: '#7A5C00', name: 'Dark Bronze' },
  { pms: 'PMS 021', hex: '#FE5000', name: 'Orange' },
  { pms: 'PMS 144', hex: '#ED7D31', name: 'Light Orange' },
  { pms: 'PMS 151', hex: '#FF8200', name: 'Orange' },
  { pms: 'PMS 152', hex: '#E87722', name: 'Dark Orange' },
  { pms: 'PMS 158', hex: '#F4831F', name: 'Medium Orange' },
  { pms: 'PMS 159', hex: '#CB6015', name: 'Burnt Orange' },
  { pms: 'PMS 160', hex: '#A85B1E', name: 'Dark Orange' },
  { pms: 'PMS 161', hex: '#7A3F1A', name: 'Brown Orange' },
  { pms: 'PMS 165', hex: '#FF6720', name: 'Bright Orange' },
  { pms: 'PMS 166', hex: '#FA5A14', name: 'Deep Orange' },
  { pms: 'PMS 167', hex: '#D44D12', name: 'Burnt Orange' },
  { pms: 'PMS 168', hex: '#8C3010', name: 'Dark Rust' },
  { pms: 'PMS 1505', hex: '#FF6900', name: 'Orange' },
  { pms: 'PMS 1585', hex: '#F4831F', name: 'Orange' },
  { pms: 'PMS 1595', hex: '#E87722', name: 'Dark Orange' },
  { pms: 'PMS 179', hex: '#F4362C', name: 'Bright Red' },
  { pms: 'PMS 180', hex: '#D4321E', name: 'Red' },
  { pms: 'PMS 181', hex: '#9C2416', name: 'Dark Red' },
  { pms: 'PMS 185', hex: '#E8112D', name: 'Red' },
  { pms: 'PMS 186', hex: '#C8102E', name: 'Crimson' },
  { pms: 'PMS 187', hex: '#9E1030', name: 'Dark Crimson' },
  { pms: 'PMS 188', hex: '#72102A', name: 'Burgundy' },
  { pms: 'PMS 193', hex: '#F0647A', name: 'Light Red' },
  { pms: 'PMS 194', hex: '#D44060', name: 'Pink Red' },
  { pms: 'PMS 195', hex: '#B02848', name: 'Deep Pink Red' },
  { pms: 'PMS 196', hex: '#8C1C38', name: 'Dark Red' },
  { pms: 'PMS 199', hex: '#CC0033', name: 'Bright Red' },
  { pms: 'PMS 200', hex: '#BA0C2F', name: 'Red' },
  { pms: 'PMS 201', hex: '#98082A', name: 'Dark Red' },
  { pms: 'PMS 202', hex: '#780820', name: 'Deep Red' },
  { pms: 'PMS 485', hex: '#DA291C', name: 'Red' },
  { pms: 'PMS 484', hex: '#AE2012', name: 'Dark Red' },
  { pms: 'PMS 704', hex: '#E8927C', name: 'Salmon' },
  { pms: 'PMS 705', hex: '#F5C4B4', name: 'Light Salmon' },
  { pms: 'PMS 182', hex: '#FFCCD4', name: 'Pale Pink' },
  { pms: 'PMS 183', hex: '#FFB3C1', name: 'Light Pink' },
  { pms: 'PMS 203', hex: '#F0768C', name: 'Pink' },
  { pms: 'PMS 204', hex: '#D63384', name: 'Deep Pink' },
  { pms: 'PMS 205', hex: '#E8607A', name: 'Hot Pink' },
  { pms: 'PMS 206', hex: '#CC2244', name: 'Deep Pink' },
  { pms: 'PMS 207', hex: '#A01040', name: 'Dark Pink' },
  { pms: 'PMS 208', hex: '#7A0832', name: 'Maroon Pink' },
  { pms: 'PMS 210', hex: '#F8A0B8', name: 'Light Pink' },
  { pms: 'PMS 211', hex: '#F87898', name: 'Pink' },
  { pms: 'PMS 212', hex: '#F04870', name: 'Bright Pink' },
  { pms: 'PMS 213', hex: '#E0285A', name: 'Hot Pink' },
  { pms: 'PMS 214', hex: '#C01A50', name: 'Deep Pink' },
  { pms: 'PMS 215', hex: '#960C40', name: 'Dark Pink' },
  { pms: 'PMS 812', hex: '#FF3EB5', name: 'Fluorescent Pink' },
  { pms: 'PMS 250', hex: '#E8C0D4', name: 'Pale Lavender' },
  { pms: 'PMS 251', hex: '#D480B4', name: 'Light Purple' },
  { pms: 'PMS 252', hex: '#C040A0', name: 'Purple' },
  { pms: 'PMS 253', hex: '#A82090', name: 'Dark Purple' },
  { pms: 'PMS 254', hex: '#8C1078', name: 'Deep Purple' },
  { pms: 'PMS 255', hex: '#6C0868', name: 'Dark Violet' },
  { pms: 'PMS 256', hex: '#D4A8D0', name: 'Light Lavender' },
  { pms: 'PMS 257', hex: '#B878B8', name: 'Lavender' },
  { pms: 'PMS 258', hex: '#8C3494', name: 'Purple' },
  { pms: 'PMS 259', hex: '#6C1D45', name: 'Dark Purple' },
  { pms: 'PMS 260', hex: '#601848', name: 'Deep Purple' },
  { pms: 'PMS 261', hex: '#501440', name: 'Dark Plum' },
  { pms: 'PMS 262', hex: '#401038', name: 'Dark Plum' },
  { pms: 'PMS 263', hex: '#DCC8E4', name: 'Pale Purple' },
  { pms: 'PMS 264', hex: '#C0A0D8', name: 'Light Purple' },
  { pms: 'PMS 265', hex: '#9060C4', name: 'Medium Purple' },
  { pms: 'PMS 266', hex: '#5C2D91', name: 'Violet' },
  { pms: 'PMS 267', hex: '#4C1484', name: 'Dark Violet' },
  { pms: 'PMS 268', hex: '#3C1070', name: 'Deep Violet' },
  { pms: 'PMS 269', hex: '#300C5C', name: 'Dark Navy Purple' },
  { pms: 'PMS 270', hex: '#B4BCDC', name: 'Periwinkle' },
  { pms: 'PMS 2665', hex: '#7B5EA7', name: 'Purple' },
  { pms: 'PMS 2685', hex: '#330072', name: 'Dark Violet' },
  { pms: 'PMS 2695', hex: '#2C1A5A', name: 'Navy Purple' },
  { pms: 'PMS 279', hex: '#418FDE', name: 'Light Blue' },
  { pms: 'PMS 280', hex: '#003DA5', name: 'Royal Blue' },
  { pms: 'PMS 281', hex: '#002D72', name: 'Dark Navy' },
  { pms: 'PMS 282', hex: '#001E62', name: 'Deep Navy' },
  { pms: 'PMS 283', hex: '#7AB2D8', name: 'Sky Blue' },
  { pms: 'PMS 284', hex: '#4090C8', name: 'Medium Blue' },
  { pms: 'PMS 285', hex: '#0072CE', name: 'Blue' },
  { pms: 'PMS 286', hex: '#003DA5', name: 'Royal Blue' },
  { pms: 'PMS 287', hex: '#003087', name: 'Dark Blue' },
  { pms: 'PMS 288', hex: '#002868', name: 'Navy' },
  { pms: 'PMS 289', hex: '#1B2A4A', name: 'Dark Navy' },
  { pms: 'PMS 290', hex: '#C4DFF0', name: 'Pale Blue' },
  { pms: 'PMS 291', hex: '#8CC8E8', name: 'Light Blue' },
  { pms: 'PMS 292', hex: '#5AA0D0', name: 'Blue' },
  { pms: 'PMS 293', hex: '#0038A8', name: 'Royal Blue' },
  { pms: 'PMS 294', hex: '#002868', name: 'Navy Blue' },
  { pms: 'PMS 295', hex: '#001E54', name: 'Dark Navy' },
  { pms: 'PMS 296', hex: '#00143C', name: 'Deep Navy' },
  { pms: 'PMS 297', hex: '#74C0E4', name: 'Sky Blue' },
  { pms: 'PMS 298', hex: '#38A8DC', name: 'Medium Blue' },
  { pms: 'PMS 299', hex: '#00A0D6', name: 'Bright Blue' },
  { pms: 'PMS 300', hex: '#005BAC', name: 'Corporate Blue' },
  { pms: 'PMS 301', hex: '#004E97', name: 'Dark Blue' },
  { pms: 'PMS 302', hex: '#003C7A', name: 'Navy' },
  { pms: 'PMS 303', hex: '#002C5C', name: 'Dark Navy' },
  { pms: 'PMS 2728', hex: '#3A5DAE', name: 'Medium Blue' },
  { pms: 'PMS 2747', hex: '#1C3F94', name: 'Deep Blue' },
  { pms: 'PMS 2757', hex: '#162A5E', name: 'Navy' },
  { pms: 'PMS 2767', hex: '#0F1F4A', name: 'Dark Navy' },
  { pms: 'PMS 2945', hex: '#005EB8', name: 'Medium Blue' },
  { pms: 'PMS 2995', hex: '#00A9E0', name: 'Cyan Blue' },
  { pms: 'PMS 3005', hex: '#0085CA', name: 'Sky Blue' },
  { pms: 'PMS 3015', hex: '#0076A8', name: 'Teal Blue' },
  { pms: 'PMS 306', hex: '#00B5E2', name: 'Cyan' },
  { pms: 'PMS 307', hex: '#0092BC', name: 'Dark Cyan' },
  { pms: 'PMS 308', hex: '#007096', name: 'Teal' },
  { pms: 'PMS 3125', hex: '#00A9CE', name: 'Light Teal' },
  { pms: 'PMS 3135', hex: '#0093B2', name: 'Teal' },
  { pms: 'PMS 3145', hex: '#007A99', name: 'Dark Teal' },
  { pms: 'PMS 3155', hex: '#006480', name: 'Deep Teal' },
  { pms: 'PMS 3165', hex: '#005068', name: 'Dark Teal' },
  { pms: 'PMS 3245', hex: '#5DD6C0', name: 'Mint' },
  { pms: 'PMS 3255', hex: '#2DC6A8', name: 'Teal Green' },
  { pms: 'PMS 3265', hex: '#00B49A', name: 'Green Teal' },
  { pms: 'PMS 3275', hex: '#00A88A', name: 'Emerald Teal' },
  { pms: 'PMS 3285', hex: '#008870', name: 'Dark Emerald' },
  { pms: 'PMS 3295', hex: '#006C58', name: 'Deep Emerald' },
  { pms: 'PMS 340', hex: '#5BC8AF', name: 'Mint Green' },
  { pms: 'PMS 341', hex: '#3AA896', name: 'Green' },
  { pms: 'PMS 342', hex: '#008060', name: 'Dark Green' },
  { pms: 'PMS 343', hex: '#006450', name: 'Forest Green' },
  { pms: 'PMS 344', hex: '#96D4C0', name: 'Light Mint' },
  { pms: 'PMS 345', hex: '#70C4AC', name: 'Mint' },
  { pms: 'PMS 346', hex: '#48B498', name: 'Medium Mint' },
  { pms: 'PMS 347', hex: '#009B77', name: 'Green' },
  { pms: 'PMS 348', hex: '#00703C', name: 'Dark Green' },
  { pms: 'PMS 349', hex: '#004C34', name: 'Forest Green' },
  { pms: 'PMS 350', hex: '#003C28', name: 'Deep Forest' },
  { pms: 'PMS 354', hex: '#00B140', name: 'Bright Green' },
  { pms: 'PMS 355', hex: '#009A44', name: 'Green' },
  { pms: 'PMS 356', hex: '#007A33', name: 'Dark Green' },
  { pms: 'PMS 357', hex: '#005C28', name: 'Forest' },
  { pms: 'PMS 361', hex: '#43B02A', name: 'Green' },
  { pms: 'PMS 362', hex: '#3A9924', name: 'Medium Green' },
  { pms: 'PMS 363', hex: '#327A1C', name: 'Dark Green' },
  { pms: 'PMS 364', hex: '#286018', name: 'Forest Green' },
  { pms: 'PMS 368', hex: '#78BE20', name: 'Lime Green' },
  { pms: 'PMS 369', hex: '#64A50C', name: 'Grass Green' },
  { pms: 'PMS 370', hex: '#508C08', name: 'Dark Lime' },
  { pms: 'PMS 375', hex: '#97D700', name: 'Bright Lime' },
  { pms: 'PMS 376', hex: '#84BD00', name: 'Lime' },
  { pms: 'PMS 377', hex: '#6C9C00', name: 'Olive Lime' },
  { pms: 'PMS 382', hex: '#C4D600', name: 'Yellow Green' },
  { pms: 'PMS 383', hex: '#AABA00', name: 'Olive Green' },
  { pms: 'PMS 384', hex: '#8C9C00', name: 'Dark Olive' },
  { pms: 'PMS 390', hex: '#D0DF00', name: 'Chartreuse' },
  { pms: 'PMS 391', hex: '#B4C000', name: 'Yellow Olive' },
  { pms: 'PMS 392', hex: '#98A400', name: 'Olive' },
  { pms: 'PMS 430', hex: '#8C9298', name: 'Blue Gray' },
  { pms: 'PMS 431', hex: '#7A8088', name: 'Dark Blue Gray' },
  { pms: 'PMS 432', hex: '#626870', name: 'Slate Gray' },
  { pms: 'PMS 433', hex: '#4C5460', name: 'Dark Slate' },
  { pms: 'PMS 434', hex: '#A8ACB4', name: 'Light Gray Blue' },
  { pms: 'PMS 435', hex: '#C0C4CC', name: 'Pale Gray Blue' },
  { pms: 'PMS 436', hex: '#D0D4D8', name: 'Very Light Gray' },
  { pms: 'PMS 437', hex: '#7A6C78', name: 'Mauve Gray' },
  { pms: 'PMS 438', hex: '#5A4C58', name: 'Dark Mauve' },
  { pms: 'PMS 439', hex: '#48383C', name: 'Very Dark Mauve' },
  { pms: 'PMS 440', hex: '#3A2C30', name: 'Almost Black' },
  { pms: 'PMS 469', hex: '#653819', name: 'Brown' },
  { pms: 'PMS 470', hex: '#8C4A18', name: 'Rust Brown' },
  { pms: 'PMS 471', hex: '#AD5A18', name: 'Orange Brown' },
  { pms: 'PMS 478', hex: '#4A200C', name: 'Dark Brown' },
  { pms: 'PMS 4625', hex: '#4A2010', name: 'Dark Brown' },
  { pms: 'PMS 4645', hex: '#C4A882', name: 'Tan' },
  { pms: 'PMS 4655', hex: '#B49470', name: 'Dark Tan' },
  { pms: 'PMS 4665', hex: '#A07C58', name: 'Brown' },
  { pms: 'PMS 4675', hex: '#8C6444', name: 'Medium Brown' },
  { pms: 'PMS 4685', hex: '#784C30', name: 'Dark Brown' },
  { pms: 'PMS Cool Gray 1', hex: '#F2F2F2', name: 'Cool Gray 1' },
  { pms: 'PMS Cool Gray 2', hex: '#E8E8E8', name: 'Cool Gray 2' },
  { pms: 'PMS Cool Gray 3', hex: '#D8D8D8', name: 'Cool Gray 3' },
  { pms: 'PMS Cool Gray 4', hex: '#C8C8C8', name: 'Cool Gray 4' },
  { pms: 'PMS Cool Gray 5', hex: '#B1B3B3', name: 'Cool Gray 5' },
  { pms: 'PMS Cool Gray 6', hex: '#A0A2A4', name: 'Cool Gray 6' },
  { pms: 'PMS Cool Gray 7', hex: '#909294', name: 'Cool Gray 7' },
  { pms: 'PMS Cool Gray 8', hex: '#808284', name: 'Cool Gray 8' },
  { pms: 'PMS Cool Gray 9', hex: '#75787B', name: 'Cool Gray 9' },
  { pms: 'PMS Cool Gray 10', hex: '#646668', name: 'Cool Gray 10' },
  { pms: 'PMS Cool Gray 11', hex: '#54565A', name: 'Cool Gray 11' },
  { pms: 'PMS Warm Gray 1', hex: '#F0EDE8', name: 'Warm Gray 1' },
  { pms: 'PMS Warm Gray 2', hex: '#E4E0D8', name: 'Warm Gray 2' },
  { pms: 'PMS Warm Gray 3', hex: '#D4CEC4', name: 'Warm Gray 3' },
  { pms: 'PMS Warm Gray 4', hex: '#C4BCAF', name: 'Warm Gray 4' },
  { pms: 'PMS Warm Gray 5', hex: '#B4AA9C', name: 'Warm Gray 5' },
  { pms: 'PMS Warm Gray 6', hex: '#A49888', name: 'Warm Gray 6' },
  { pms: 'PMS Warm Gray 7', hex: '#948878', name: 'Warm Gray 7' },
  { pms: 'PMS Warm Gray 8', hex: '#847868', name: 'Warm Gray 8' },
  { pms: 'PMS Warm Gray 9', hex: '#746858', name: 'Warm Gray 9' },
  { pms: 'PMS Warm Gray 10', hex: '#645848', name: 'Warm Gray 10' },
  { pms: 'PMS Warm Gray 11', hex: '#544838', name: 'Warm Gray 11' },
  { pms: 'PMS Black', hex: '#000000', name: 'Black' },
  { pms: 'PMS Black 2', hex: '#1A1714', name: 'Warm Black' },
  { pms: 'PMS Black 3', hex: '#1A1F1C', name: 'Cool Black' },
  { pms: 'PMS Black 4', hex: '#1A1410', name: 'Brown Black' },
  { pms: 'PMS Black 6', hex: '#10141A', name: 'Blue Black' },
  { pms: 'PMS White', hex: '#FFFFFF', name: 'White' },
  { pms: 'PMS 871', hex: '#8B6914', name: 'Metallic Gold' },
  { pms: 'PMS 872', hex: '#967822', name: 'Metallic Gold' },
  { pms: 'PMS 873', hex: '#A08230', name: 'Metallic Gold' },
  { pms: 'PMS 874', hex: '#AA8C3C', name: 'Metallic Gold' },
  { pms: 'PMS 875', hex: '#B49648', name: 'Metallic Gold' },
  { pms: 'PMS 876', hex: '#BEA054', name: 'Metallic Gold' },
  { pms: 'PMS 877', hex: '#8A9099', name: 'Metallic Silver' },
  { pms: 'PMS 7549', hex: '#F0B323', name: 'Yellow Gold' },
  { pms: 'PMS 4525', hex: '#C9A96E', name: 'Warm Gold' },
  { pms: 'PMS 801', hex: '#009EE3', name: 'Fluorescent Blue' },
  { pms: 'PMS 802', hex: '#43B02A', name: 'Fluorescent Green' },
  { pms: 'PMS 803', hex: '#FFE900', name: 'Fluorescent Yellow' },
  { pms: 'PMS 804', hex: '#FF8200', name: 'Fluorescent Orange' },
  { pms: 'PMS 805', hex: '#FF3C28', name: 'Fluorescent Red' },
  { pms: 'PMS 806', hex: '#FF00A0', name: 'Fluorescent Magenta' },
  { pms: 'PMS 807', hex: '#CC00CC', name: 'Fluorescent Purple' },
];

const COLOUR_GROUPS = ['All', 'Yellows', 'Oranges', 'Reds', 'Pinks', 'Purples', 'Blues', 'Teals', 'Greens', 'Browns', 'Grays', 'Black & White', 'Metallic', 'Fluorescent'];

function getGroup(c) {
  const n = c.name.toLowerCase();
  const p = c.pms.toLowerCase();
  if (n.includes('fluorescent')) return 'Fluorescent';
  if (n.includes('metallic') || n.includes('silver') || p.includes('87')) return 'Metallic';
  if (n === 'black' || n === 'white' || n.includes('warm black') || n.includes('cool black') || n.includes('blue black') || n.includes('brown black')) return 'Black & White';
  if (n.includes('gray') || n.includes('slate') || n.includes('mauve')) return 'Grays';
  if (n.includes('brown') || n.includes('tan') || n.includes('bronze') || n.includes('rust')) return 'Browns';
  if (n.includes('green') || n.includes('lime') || n.includes('olive') || n.includes('grass') || n.includes('forest') || n.includes('chartreuse')) return 'Greens';
  if (n.includes('teal') || n.includes('mint') || n.includes('emerald') || n.includes('cyan')) return 'Teals';
  if (n.includes('blue') || n.includes('navy') || n.includes('sky') || n.includes('periwinkle')) return 'Blues';
  if (n.includes('purple') || n.includes('violet') || n.includes('lavender') || n.includes('plum')) return 'Purples';
  if (n.includes('pink') || n.includes('salmon') || n.includes('magenta')) return 'Pinks';
  if (n.includes('red') || n.includes('crimson') || n.includes('burgundy')) return 'Reds';
  if (n.includes('orange') || n.includes('burnt')) return 'Oranges';
  if (n.includes('yellow') || n.includes('amber') || n.includes('gold') || n.includes('lemon')) return 'Yellows';
  return 'Other';
}

export default function PMSColourMatchPage() {
  const [activeGroup, setActiveGroup] = useState('All');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState('');

  const filtered = PMS_COLOURS.filter(c => {
    const matchGroup = activeGroup === 'All' || getGroup(c) === activeGroup;
    const matchSearch = !search || c.pms.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase());
    return matchGroup && matchSearch;
  });

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 2000);
  }

  return (
    <div style={{ background: BG, fontFamily: '"DM Sans", sans-serif', minHeight: '100vh' }}>
      <div style={{ background: NAVY, padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '0 auto 32px' }} />
          <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 600, color: '#fff', letterSpacing: '2px', lineHeight: 1.1, margin: '0 0 16px' }}>
            PMS Colour Match
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.7 }}>
            The Pantone® Matching System (PMS) ensures your brand colours are reproduced consistently across every product we make.
          </p>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '32px auto 0' }} />
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 40px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
          {[
            { icon: '🎨', title: 'What is PMS?', desc: 'Pantone Matching System is a standardised colour system used worldwide. Each colour has a unique number so your logo looks the same on every product, every time.' },
            { icon: '🔍', title: 'How to find your PMS?', desc: "Check your brand guidelines, ask your designer, or use Adobe Illustrator to identify the colour. You can also email us your logo and we'll help identify it." },
            { icon: '✅', title: 'Why it matters?', desc: 'Without a PMS number, colours may be interpreted differently by different printers. PMS eliminates guesswork and ensures brand consistency across all your products.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
              <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '20px', fontWeight: 600, color: NAVY, marginBottom: '10px' }}>{title}</div>
              <div style={{ fontSize: '14px', color: '#5A5A5A', lineHeight: 1.8 }}>{desc}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderLeft: `4px solid ${GOLD}`, borderRadius: '0 8px 8px 0', padding: '16px 20px', marginBottom: '48px' }}>
          <p style={{ fontSize: '14px', color: '#5A5A5A', lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: NAVY }}>Please note:</strong> Exact colour reproduction can vary depending on product material and branding method. Hex values shown are approximate digital representations only. We recommend requesting a physical sample for colour-critical orders.
          </p>
        </div>

        <input type="text" placeholder="Search PMS number or colour name..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '15px', fontFamily: '"DM Sans", sans-serif', outline: 'none', color: NAVY, boxSizing: 'border-box', marginBottom: '16px' }}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {COLOUR_GROUPS.map(group => (
            <button key={group} onClick={() => setActiveGroup(group)}
              style={{ padding: '6px 14px', borderRadius: '20px', border: `1.5px solid ${activeGroup === group ? NAVY : '#E0DDD7'}`, background: activeGroup === group ? NAVY : '#fff', color: activeGroup === group ? '#fff' : '#5A5A5A', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
              {group}
            </button>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: '#B0AAA3', marginBottom: '20px' }}>
          Showing {filtered.length} colours — click any colour to copy the PMS number
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px', marginBottom: '80px' }}>
          {filtered.map(colour => (
            <div key={colour.pms}
              onClick={() => copyToClipboard(colour.pms)}
              title={`Click to copy ${colour.pms}`}
              style={{ background: '#fff', border: `1.5px solid ${copied === colour.pms ? GOLD : '#E0DDD7'}`, borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ height: '64px', background: colour.hex, border: colour.hex === '#FFFFFF' ? '1px solid #E0DDD7' : 'none' }} />
              <div style={{ padding: '7px 9px' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: NAVY, marginBottom: '2px', fontFamily: '"DM Mono", monospace', lineHeight: 1.3 }}>{colour.pms}</div>
                <div style={{ fontSize: '9px', color: '#7A7570', lineHeight: 1.3 }}>{colour.name}</div>
                {copied === colour.pms && <div style={{ fontSize: '9px', color: GOLD, fontWeight: 700, marginTop: '2px' }}>✓ Copied!</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: NAVY, padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '36px', color: '#fff', marginBottom: '16px' }}>
            Not sure of your PMS colour?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '32px' }}>
            Send us your logo file and we will identify the closest PMS match for you at no charge.
          </p>
          <a href="/contact" style={{ display: 'inline-block', background: GOLD, color: '#fff', padding: '16px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
            Send Us Your Logo
          </a>
        </div>
      </div>
    </div>
  );
}

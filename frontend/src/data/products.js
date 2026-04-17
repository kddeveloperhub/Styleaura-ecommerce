// src/data/products.js

import collarImage from '../assets/collar.jpg';
import denimImage from '../assets/denim.jpg';
import linenImage from '../assets/linen.jpg';
import fromalmenImage from '../assets/fromalmen.jpg';
import cropImage from '../assets/crop.jpg';
import offShoulderImage from '../assets/offshoulder.jpg';
import formalImage from '../assets/formal.jpg';
import blouseImage from '../assets/blouse.jpg';

// ✅ Reduced men's prices slightly
export const menProducts = [
  { id: 1, name: 'Mandarin Collar Shirt', price: 14, image: collarImage },
  { id: 2, name: 'Denim Shirt', price: 20, image: denimImage },
  { id: 3, name: 'Linen Shirt', price: 13, image: linenImage },
  { id: 4, name: 'Formal Shirt', price: 9, image: fromalmenImage }
];

// ✅ Reduced women's prices slightly
export const womenProducts = [
  { id: 5, name: 'Crop Top', price: 17, image: cropImage },
  { id: 6, name: 'Off-Shoulder Top', price: 12, image: offShoulderImage },
  { id: 7, name: 'Formal Shirt', price: 18, image: formalImage },
  { id: 8, name: 'Elegant Blouse', price: 9, image: blouseImage }
];

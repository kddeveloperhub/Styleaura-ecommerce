// Enhanced Women.jsx page (full update)
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useCart } from '../context/CartContext';

// Import images
import linenJumpsuit from '../assets/women/linen-jumpsuit.avif';
import bohemianBlouse from '../assets/women/bohemian-blouse.jpg';
import pleatedSkirt from '../assets/women/pleated-skirt.webp';
import oversizedBlazer from '../assets/women/oversized-blazer.jpg';
import wrapDress from '../assets/women/wrap-dress.webp';
import vintageDenim from '../assets/women/vintage-denim.webp';
import satinTop from '../assets/women/satin-top.webp';
import culottePants from '../assets/women/culotte-pants.webp';
import trenchCoat from '../assets/women/trench-coat.webp';
import sequinDress from '../assets/women/sequin-dress.webp';
import offShoulderTop from '../assets/women/off-shoulder-top.jpg';
import palazzoPants from '../assets/women/palazzo-pants.jpg';
import featherJacket from '../assets/women/feather-jacket.jpg';
import embroideredKurti from '../assets/women/embroidered-kurti.jpg';
import velvetGown from '../assets/women/velvet-gown.webp';
import knitCardigan from '../assets/women/knit-cardigan.jpg';
import womenBanner from '../assets/women-banner.png';

const allProducts = [
  { id: 1, name: "Linen Jumpsuit", image: linenJumpsuit, price: 21, brand: "UrbanFemme", style: "Chic", color: "Beige", stock: true },
  { id: 2, name: "Bohemian Blouse", image: bohemianBlouse, price: 26, brand: "StyleAura", style: "Boho", color: "White", stock: true },
  { id: 3, name: "Pleated Skirt", image: pleatedSkirt, price: 13, brand: "ElegantEase", style: "Formal", color: "Black", stock: true },
  { id: 4, name: "Oversized Blazer", image: oversizedBlazer, price: 28, brand: "BoldBasics", style: "Casual", color: "Black", stock: true },
  { id: 5, name: "Wrap Dress", image: wrapDress, price: 11.98, brand: "UrbanFemme", style: "Partywear", color: "Red", stock: true },
  { id: 6, name: "Vintage Denim", image: vintageDenim, price: 13.17, brand: "StyleAura", style: "Casual", color: "Blue", stock: true },
  { id: 7, name: "Satin Top", image: satinTop, price: 5.99, brand: "ElegantEase", style: "Chic", color: "White", stock: true },
  { id: 8, name: "Culotte Pants", image: culottePants, price: 6.99, brand: "BoldBasics", style: "Formal", color: "Beige", stock: true },
  { id: 9, name: "Trench Coat", image: trenchCoat, price: 11.98, brand: "UrbanFemme", style: "Formal", color: "Green", stock: true },
  { id: 10, name: "Sequin Dress", image: sequinDress, price: 55, brand: "StyleAura", style: "Partywear", color: "Red", stock: true },
  { id: 11, name: "Off-Shoulder Top", image: offShoulderTop, price: 15, brand: "ElegantEase", style: "Boho", color: "White", stock: true },
  { id: 12, name: "Palazzo Pants", image: palazzoPants, price: 11.98, brand: "BoldBasics", style: "Chic", color: "Beige", stock: true },
  { id: 13, name: "Feather Jacket", image: featherJacket, price: 139.99, brand: "UrbanFemme", style: "Partywear", color: "Black", stock: true },
  { id: 14, name: "Embroidered Kurti", image: embroideredKurti, price: 6, brand: "StyleAura", style: "Boho", color: "Green", stock: true },
  { id: 15, name: "Velvet Gown", image: velvetGown, price: 35, brand: "ElegantEase", style: "Partywear", color: "Red", stock: true },
  { id: 16, name: "Knit Cardigan", image: knitCardigan, price: 17, brand: "BoldBasics", style: "Casual", color: "White", stock: true },
];

const Women = () => {
  const [filters, setFilters] = useState({ brand: '', style: '', color: '', priceRange: '' });
  const [sortOption, setSortOption] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalProduct, setModalProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { addToCart } = useCart();


  useEffect(() => { AOS.init({ duration: 700, once: true }); }, []);

  const filtered = allProducts.filter(({ brand, style, color, price }) => {
    const [min, max] = filters.priceRange?.split('-').map(Number) || [];
    return (!filters.brand || brand === filters.brand) &&
           (!filters.style || style === filters.style) &&
           (!filters.color || color === filters.color) &&
           (!filters.priceRange || (price >= min && price <= max));
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'Price: Low-High') return a.price - b.price;
    if (sortOption === 'Price: High-Low') return b.price - a.price;
    return 0;
  });

  const itemsPerPage = 8;
  const paged = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const openModal = (product) => {
    setModalProduct(product);
    setSelectedSize(null);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalProduct(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative">
        <img src={womenBanner} alt="Women's Fashion" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 md:px-16 text-white">
  <h1 className="text-3xl md:text-5xl font-bold mb-2">Women's Collection</h1>
  <p className="max-w-xl mb-3">
    Discover our curated selection of women's fashion designed to elevate your style with premium quality and modern aesthetics.
  </p>

  {/* Breadcrumbs */}
  <nav className="text-lg md:text-base text-pink-200">
    <ol className="inline-flex items-center space-x-2">
      <li>
        <a href="/" className="hover:text-white hover:underline">Home</a>
      </li>
      <li>/</li>
      <li className="text-white font-medium">Women</li>
    </ol>
  </nav>
</div>

      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-10">
        <div className="hidden lg:block w-64">
          <div className="bg-white p-4 rounded shadow space-y-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <select onChange={(e) => setFilters({ ...filters, brand: e.target.value })} className="w-full p-2 border rounded">
              <option value="">All Brands</option>
              {[...new Set(allProducts.map(p => p.brand))].map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select onChange={(e) => setFilters({ ...filters, style: e.target.value })} className="w-full p-2 border rounded">
              <option value="">All Styles</option>
              {[...new Set(allProducts.map(p => p.style))].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select onChange={(e) => setFilters({ ...filters, color: e.target.value })} className="w-full p-2 border rounded">
              <option value="">All Colors</option>
              {[...new Set(allProducts.map(p => p.color))].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })} className="w-full p-2 border rounded">
              <option value="">All Prices</option>
              <option value="0-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
            </select>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 text-sm">
              Showing {paged.length} of {sorted.length} products
            </span>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="border p-2 rounded text-sm">
              <option value="Newest">Newest</option>
              <option value="Price: Low-High">Price: Low-High</option>
              <option value="Price: High-Low">Price: High-Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paged.map((product) => {
              const inrPrice = (product.price * 83.5).toFixed(0);
              return (
                <div key={product.id} data-aos="fade-up" className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-72 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-pink-500 font-bold">₹{inrPrice}</span>
                      <button onClick={() => openModal(product)} className="text-sm text-cyan-500 underline">Quick View</button>
                    </div>
                  </div>
                </div>
              );
            })}

          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-pink-500 text-white' : 'bg-gray-100'}`}>{i + 1}</button>
            ))}
          </div>
        </div>
      </div>

      {modalProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full relative animate-fade-in-out">
            <button onClick={closeModal} className="absolute top-2 right-2 text-xl">&times;</button>
            <img src={modalProduct.image} alt={modalProduct.name} className="w-full h-64 object-cover rounded" />
            <h2 className="text-xl font-semibold mt-4">{modalProduct.name}</h2>
           <p className="text-pink-500 text-lg font-bold">₹{(modalProduct.price * 83.5).toFixed(0)}</p>

            <div className="mt-4">
              <label className="block font-semibold mb-2">Select Size</label>
              <div className="flex gap-2 flex-wrap">
                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-1 border rounded ${selectedSize === size ? 'bg-pink-500 text-white' : ''}`}>{size}</button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={() => { addToCart(modalProduct); closeModal(); }} className="px-4 py-2 bg-pink-500 text-white rounded">Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

export default Women;

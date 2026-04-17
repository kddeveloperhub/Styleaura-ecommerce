import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useCart } from '../context/CartContext';

import denimShirt from '../assets/denim.jpg';
import denimJeans from '../assets/denim-jeans.avif';
import sweater from '../assets/sweater.jpg';
import formalShirt from '../assets/fromalmen.jpg';
import graphicTshirt from '../assets/graphic.jpg';
import cargoShorts from '../assets/cargo.avif';
import blazer from '../assets/blazer.jpg';
import leatherJacket from '../assets/leather-jacket.jpg';
import linenShirt from '../assets/linen.jpg';
import collarShirt from '../assets/collar.jpg';
import poloTshirt from '../assets/polo.jpg';
import chinosPants from '../assets/chinos.jpg';

const Men = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('Newest');
  const [modalProduct, setModalProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [filters, setFilters] = useState({ brand: '', style: '', color: '', priceRange: '' });
  const { addToCart } = useCart();

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const products = [
    { id: 1, name: 'Denim Shirt', price: 0.1, brand: 'DenimCo', style: 'Casual', color: 'Blue', image: denimShirt, stock: true },
    { id: 2, name: 'Denim Jeans', price: 25, brand: 'DenimCo', style: 'Casual', color: 'Blue', image: denimJeans, stock: true },
    { id: 3, name: 'V-Neck Sweater', price: 20, brand: 'StyleAura', style: 'Smart Casual', color: 'Brown', image: sweater, stock: true },
    { id: 4, name: 'Formal Shirt', price: 10, brand: 'FormalFit', style: 'Formal', color: 'White', image: formalShirt, stock: true },
    { id: 5, name: 'Graphic T-Shirt', price: 11, brand: 'CasualComfort', style: 'Casual', color: 'Black', image: graphicTshirt, stock: true },
    { id: 6, name: 'Cargo Shorts', price: 13.5, brand: 'UrbanStyle', style: 'Sporty', color: 'Beige', image: cargoShorts, stock: true },
    { id: 7, name: 'Casual Blazer', price: 21, brand: 'StyleAura', style: 'Smart Casual', color: 'Blue', image: blazer, stock: true },
    { id: 8, name: 'Leather Jacket', price: 29, brand: 'LeatherLux', style: 'Vintage', color: 'Black', image: leatherJacket, stock: true },
    { id: 9, name: 'Linen Shirt', price: 15, brand: 'LinenLux', style: 'Smart Casual', color: 'White', image: linenShirt, stock: true },
    { id: 10, name: 'Mandarin Collar Shirt', price: 16, brand: 'FormalFit', style: 'Formal', color: 'White', image: collarShirt, stock: true },
    { id: 11, name: 'Striped Polo T-Shirt', price: 12, brand: 'PoloPlus', style: 'Casual', color: 'Red', image: poloTshirt, stock: true },
    { id: 12, name: 'Slim Fit Chinos Pants', price: 14, brand: 'TrendyTrousers', style: 'Casual', color: 'Beige', image: chinosPants, stock: true },
  ];

  const filtered = products.filter(({ brand, style, color, price }) => {
    const [min, max] = filters.priceRange?.split('-').map(Number) || [];
    return (!filters.brand || brand === filters.brand) &&
      (!filters.style || style === filters.style) &&
      (!filters.color || color === filters.color) &&
      (!filters.priceRange || (price >= min && price <= max));
  });

  const sortedProducts = (() => {
    switch (sortOption) {
      case 'Price: Low-High': return [...filtered].sort((a, b) => a.price - b.price);
      case 'Price: High-Low': return [...filtered].sort((a, b) => b.price - a.price);
      default: return filtered;
    }
  })();

  const itemsPerPage = 8;
  const currentProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

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
    <div className="min-h-screen bg-white px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-2">Men's Collection</h1>
      <div className="w-24 h-1 bg-pink-500 mx-auto mb-6"></div>
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-4">
        Explore premium fashion crafted for modern men.
      </p>

      {/* Breadcrumb */}
      <div className="text-center text-pink-500 mb-10">
        <a href="/" className="hover:underline">Home</a> / <span className="text-gray-800">Men</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* FILTERS (UNCHANGED) */}
        <aside className="hidden lg:block w-64" data-aos="fade-right">
          <div className="bg-white p-4 border rounded shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            {['brand', 'style', 'color', 'priceRange'].map((key) => (
              <div key={key} className="mb-4">
                <label className="block text-sm mb-1 capitalize">{key}</label>
                <select
                  onChange={(e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All</option>
                  {[...new Set(products.map(p => p[key] || ''))].filter(Boolean).map((val) => (
                    <option key={val}>{val}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </aside>

        {/* PRODUCTS */}
        <section className="flex-1">
          <div className="flex justify-between mb-6">
            <span className="text-sm text-gray-500">
              Showing {currentProducts.length} of {filtered.length}
            </span>
            <select onChange={(e) => setSortOption(e.target.value)} className="border p-2 rounded">
              <option>Newest</option>
              <option>Price: Low-High</option>
              <option>Price: High-Low</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow hover:shadow-xl transition group">
                <div className="relative h-80 overflow-hidden rounded-t-xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <button
                    onClick={() => openModal(product)}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded text-xs hover:bg-pink-600"
                  >
                    Quick View
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <div className="flex justify-between mt-2">
                    <span className="text-pink-500 font-bold">
                      ₹{(product.price * 83.5).toFixed(0)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded ${currentPage === page ? 'bg-pink-500 text-white' : ''
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* MODAL */}
      {modalProduct && (
        <div onClick={closeModal} className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 rounded max-w-md w-full">
            <img
              src={modalProduct.image}
              alt={modalProduct.name} // ✅ FIXED
              onError={(e) => (e.target.src = "/fallback.jpg")} 
              className="w-full h-64 object-contain bg-gray-100 rounded"
            />
            <h2 className="mt-4 font-semibold">{modalProduct.name}</h2>
            <p className="text-pink-500 font-bold">
              ₹{(modalProduct.price * 83.5).toFixed(0)}
            </p>

            <div className="mt-4 flex gap-2">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border rounded ${selectedSize === size ? 'bg-pink-500 text-white' : ''
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                if (!selectedSize) return alert('Select size');
                addToCart({ ...modalProduct, size: selectedSize });
                closeModal();
              }}
              className="mt-4 w-full bg-pink-500 text-white py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Men;
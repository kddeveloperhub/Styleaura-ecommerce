import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useCart } from '../context/CartContext';

// Images
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
  { id: 1, name: "Linen Jumpsuit", image: linenJumpsuit, price: 21, brand: "UrbanFemme", style: "Chic", color: "Beige" },
  { id: 2, name: "Bohemian Blouse", image: bohemianBlouse, price: 26, brand: "StyleAura", style: "Boho", color: "White" },
  { id: 3, name: "Pleated Skirt", image: pleatedSkirt, price: 13, brand: "ElegantEase", style: "Formal", color: "Black" },
  { id: 4, name: "Oversized Blazer", image: oversizedBlazer, price: 28, brand: "BoldBasics", style: "Casual", color: "Black" },
  { id: 5, name: "Wrap Dress", image: wrapDress, price: 11.98, brand: "UrbanFemme", style: "Partywear", color: "Red" },
  { id: 6, name: "Vintage Denim", image: vintageDenim, price: 13.17, brand: "StyleAura", style: "Casual", color: "Blue" },
  { id: 7, name: "Satin Top", image: satinTop, price: 5.99, brand: "ElegantEase", style: "Chic", color: "White" },
  { id: 8, name: "Culotte Pants", image: culottePants, price: 6.99, brand: "BoldBasics", style: "Formal", color: "Beige" },
  { id: 9, name: "Trench Coat", image: trenchCoat, price: 11.98, brand: "UrbanFemme", style: "Formal", color: "Green" },
  { id: 10, name: "Sequin Dress", image: sequinDress, price: 55, brand: "StyleAura", style: "Partywear", color: "Red" },
  { id: 11, name: "Off-Shoulder Top", image: offShoulderTop, price: 15, brand: "ElegantEase", style: "Boho", color: "White" },
  { id: 12, name: "Palazzo Pants", image: palazzoPants, price: 11.98, brand: "BoldBasics", style: "Chic", color: "Beige" },
  { id: 13, name: "Feather Jacket", image: featherJacket, price: 139.99, brand: "UrbanFemme", style: "Partywear", color: "Black" },
  { id: 14, name: "Embroidered Kurti", image: embroideredKurti, price: 6, brand: "StyleAura", style: "Boho", color: "Green" },
  { id: 15, name: "Velvet Gown", image: velvetGown, price: 35, brand: "ElegantEase", style: "Partywear", color: "Red" },
  { id: 16, name: "Knit Cardigan", image: knitCardigan, price: 17, brand: "BoldBasics", style: "Casual", color: "White" },
];

const Women = () => {
  const [filters, setFilters] = useState({ brand: '', style: '', color: '', priceRange: '' });
  const [sortOption, setSortOption] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalProduct, setModalProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

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
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <div className="relative w-full h-[500px] md:h-[600px]">
        <img
          src={womenBanner}
          alt="Women's Fashion Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 md:px-16 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Women's Collection
          </h1>

          <p className="max-w-xl text-sm md:text-lg mb-4">
            Discover our curated selection of women's fashion designed to elevate your style with premium quality and modern aesthetics.
          </p>

          <nav className="text-sm md:text-base text-pink-200">
            <ol className="inline-flex items-center space-x-2">
              <li><a href="/" className="hover:text-white hover:underline">Home</a></li>
              <li>/</li>
              <li className="text-white font-medium">Women</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 flex gap-8">

        {/* FILTERS */}
        <aside className="hidden lg:block w-64">
          <div className="p-4 border rounded shadow-sm space-y-3">
            <h2 className="font-semibold text-lg">Filters</h2>

            {['brand', 'style', 'color', 'priceRange'].map((key) => (
              <select
                key={key}
                className="w-full p-2 border rounded"
                onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
              >
                <option value="">All {key}</option>
                {[...new Set(allProducts.map(p => p[key]))].filter(Boolean).map(val => (
                  <option key={val}>{val}</option>
                ))}
              </select>
            ))}
          </div>
        </aside>

        {/* PRODUCTS */}
        <main className="flex-1">

          {/* SORT */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 text-sm">
              Showing {paged.length} of {sorted.length} products
            </span>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border p-2 rounded"
            >
              <option>Newest</option>
              <option>Price: Low-High</option>
              <option>Price: High-Low</option>
            </select>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paged.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition group">
                <div className="relative h-72 overflow-hidden">

                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => (e.target.src = "/fallback.jpg")} // 🔥 bonus safety
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <button
                    onClick={() => openModal(product)}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Quick View
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-pink-500 font-bold">
                    ₹{(product.price * 83.5).toFixed(0)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${currentPage === i + 1
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200'
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>

      {/* MODAL */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-md w-full relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-xl">×</button>

            <img
              src={modalProduct.image}
              alt={modalProduct.name}
              onError={(e) => (e.target.src = "/fallback.jpg")} // 🔥 optional
              className="w-full h-64 object-contain bg-gray-100 rounded"
            />
            <h2 className="text-xl font-semibold mt-4">{modalProduct.name}</h2>
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
              onClick={() => { addToCart(modalProduct); closeModal(); }}
              className="mt-4 bg-pink-500 text-white px-4 py-2 rounded w-full"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Women;
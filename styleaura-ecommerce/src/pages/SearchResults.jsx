import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { menProducts, womenProducts } from '../data/products';

const SearchResults = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get('query')?.toLowerCase() || '';
  const allProducts = [...menProducts, ...womenProducts];
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = allProducts.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen px-4 py-10 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>

        {/* Filter Controls */}
        <div className="mb-6 flex gap-4 items-center">
          <label className="text-sm font-medium">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          >
            <option value="all">All</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </div>

        {/* Products */}
        {filtered.length === 0 ? (
          <p className="text-gray-600">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

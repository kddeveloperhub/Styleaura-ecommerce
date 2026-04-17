import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { menProducts, womenProducts } from '../data/products';

const SearchResults = () => {
  const { search } = useLocation();
  const query =
    new URLSearchParams(search).get('query')?.toLowerCase() || '';

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('default');

  // ✅ Add category manually
  const allProducts = useMemo(() => [
  ...menProducts.map((p) => ({ ...p, category: 'men' })),
  ...womenProducts.map((p) => ({ ...p, category: 'women' })),
], []);

  // 🔍 FILTER
  const filtered = useMemo(() => {
  return allProducts.filter((product) => {
    const matchesQuery = product.name
      .toLowerCase()
      .includes(query);

    const matchesCategory =
      selectedCategory === 'all' ||
      product.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });
}, [query, selectedCategory, allProducts]); 

  // 🔄 SORT
  const sortedProducts = useMemo(() => {
    if (sortOption === 'low') {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortOption === 'high') {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [filtered, sortOption]);

  return (
    <div className="min-h-screen px-4 py-10 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h2 className="text-3xl font-bold mb-2">
          Search Results
        </h2>
        <p className="text-gray-500 mb-6">
          Showing results for "<span className="text-pink-500">{query}</span>"
        </p>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">

          {/* LEFT */}
          <div className="flex gap-4 items-center flex-wrap">
            {/* CATEGORY */}
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value)
              }
              className="border px-3 py-2 rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>

            {/* SORT */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm"
            >
              <option value="default">Sort</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
            </select>

            {/* RESET */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSortOption('default');
              }}
              className="text-sm text-gray-500 hover:text-pink-500"
            >
              Reset
            </button>
          </div>

          {/* RIGHT */}
          <p className="text-sm text-gray-500">
            {sortedProducts.length} results found
          </p>
        </div>

        {/* PRODUCTS */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">
              No products found 😕
            </h3>
            <p className="text-gray-500">
              Try searching something else or change filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sortedProducts.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
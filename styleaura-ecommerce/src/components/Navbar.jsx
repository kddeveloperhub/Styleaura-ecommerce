import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [query, setQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLinkClick = () => setIsMenuOpen(false);

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Men', path: '/men' },
    { label: 'Women', path: '/women' },
    { label: 'Accessories', path: '/accessories' },
    { label: 'Wishlist', path: '/wishlist' },
    { label: 'Contact', path: '/contact' },
    // Optional admin menu item (you can remove this if not needed)
  { label: 'Admin', path: '/admin/login' },
  { label: 'Admin Dashboard', path: '/admin/dashboard' }

];

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
          {/* Logo + Mobile Menu Button */}
          <div className="flex justify-between md:justify-start items-center">
            <Link to="/" className="text-2xl font-bold text-pink-500">StyleAura</Link>
            <button
              className="md:hidden text-2xl text-pink-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex justify-center gap-6 text-sm font-medium text-gray-700">
            {menuItems.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                onClick={handleLinkClick}
                className="hover:text-pink-500 capitalize"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Cart + Search */}
          <div className="hidden md:flex justify-end items-center gap-4">
            <Link to="/cart" className="relative inline-flex items-center hover:text-pink-500">
              <span className="text-xl">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="px-3 py-2 border rounded text-sm w-44"
              />
              <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded text-sm">Go</button>
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 pb-4 space-y-3 text-sm font-medium text-gray-700">
            {menuItems.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                onClick={handleLinkClick}
                className="block hover:text-pink-500 capitalize"
              >
                {label}
              </Link>
            ))}
            <Link
              to="/cart"
              onClick={handleLinkClick}
              className="block hover:text-pink-500 capitalize"
            >
              Cart 🛒 {itemCount > 0 && <span className="ml-1">({itemCount})</span>}
            </Link>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="pt-3 flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3 py-2 border rounded text-sm"
              />
              <button
                type="submit"
                className="bg-pink-500 text-white px-4 py-2 rounded text-sm"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Floating Cart Icon for Mobile */}
      <Link
        to="/cart"
        style={{ bottom: '9.25rem' }}
        className="fixed right-6 z-50 md:hidden bg-pink-500 text-white text-xl p-3 rounded-full shadow-lg"
      >
        🛒
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-pink-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {itemCount}
          </span>
        )}
      </Link>
    </>
  );
};

export default Navbar;

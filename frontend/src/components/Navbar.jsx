import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';

const Navbar = () => {
  const { cartItems } = useCart();
  const { user, role } = useAuth();

  const isAdmin = user && role === "admin";
  const isLoadingRole = user && role === null;

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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4">

          {/* Logo */}
          <div className="flex justify-between md:justify-start items-center">
            <Link to="/" className="text-2xl font-bold text-pink-500">
              StyleAura
            </Link>
            <button
              className="md:hidden text-2xl text-pink-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex justify-center gap-6 text-sm font-medium text-gray-700">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/men">Men</Link>
            <Link to="/women">Women</Link>
            <Link to="/accessories">Accessories</Link>
            <Link to="/wishlist">Wishlist</Link>

            {user && <Link to="/my-orders">My Orders</Link>}

            <Link to="/contact">Contact</Link>

            {/* 🔥 ADMIN */}
            {!isLoadingRole && isAdmin && (
              <Link to="/admin/dashboard" className="text-cyan-600 font-semibold">
                Admin
              </Link>
            )}
          </nav>

          {/* Right */}
          <div className="hidden md:flex justify-end items-center gap-4">

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="px-3 py-2 border rounded text-sm w-40"
              />
              <button className="bg-pink-500 text-white px-3 py-2 rounded text-sm">
                Go
              </button>
            </form>

            {/* Cart */}
            <Link to="/cart" className="relative text-xl">
              🛒
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <>
                <span className="text-sm text-gray-600 truncate max-w-[120px]">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup" className="bg-pink-500 text-white px-3 py-1 rounded">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 pb-4 space-y-3 text-sm">

            <Link to="/" onClick={handleLinkClick}>Home</Link>
            <Link to="/about" onClick={handleLinkClick}>About</Link>
            <Link to="/men" onClick={handleLinkClick}>Men</Link>
            <Link to="/women" onClick={handleLinkClick}>Women</Link>
            <Link to="/wishlist" onClick={handleLinkClick}>Wishlist</Link>

            {user && <Link to="/my-orders">My Orders</Link>}

            <Link to="/contact">Contact</Link>

            {/* ADMIN */}
            {!isLoadingRole && isAdmin && (
              <Link to="/admin/dashboard">Admin Dashboard</Link>
            )}

            {user ? (
              <>
                <p>{user.email}</p>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Floating Cart */}
      <Link
        to="/cart"
        className="fixed right-6 bottom-24 z-50 md:hidden bg-pink-500 text-white text-xl p-3 rounded-full shadow-lg"
      >
        🛒
      </Link>
    </>
  );
};

export default Navbar;
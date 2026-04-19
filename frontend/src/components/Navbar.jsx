import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";

const Navbar = () => {
  const { cartItems } = useCart();
  const { user, role } = useAuth();

  const isAdmin = user && role === "admin";
  const isLoadingRole = user && role === null;

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 🔥 LOCK SCROLL ON MOBILE MENU
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold text-pink-500">
            StyleAura
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
            <Link to="/">Home</Link>
            <Link to="/men">Men</Link>
            <Link to="/women">Women</Link>
            <Link to="/accessories">Accessories</Link>
            <Link to="/wishlist">Wishlist</Link>
            {user && <Link to="/my-orders">Orders</Link>}
            {isAdmin && !isLoadingRole && (
              <Link to="/admin/dashboard" className="text-cyan-600 font-semibold">
                Admin
              </Link>
            )}
          </nav>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-4">
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

            <Link to="/cart" className="relative text-xl">
              🛒
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <span className="text-sm truncate max-w-[120px]">
                  {user.email}
                </span>
                <button onClick={handleLogout} className="bg-gray-200 px-3 py-1 rounded">
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

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* 🔥 MOBILE OVERLAY MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50">

          <div className="bg-white w-3/4 max-w-xs h-full p-5 shadow-lg">

            {/* CLOSE */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={closeMenu} className="text-xl">✕</button>
            </div>

            {/* SEARCH */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-5">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
              />
              <button className="bg-pink-500 text-white px-3 rounded">Go</button>
            </form>

            {/* LINKS */}
            <div className="flex flex-col gap-4 text-gray-700 text-base">

              <Link to="/" onClick={closeMenu}>Home</Link>
              <Link to="/men" onClick={closeMenu}>Men</Link>
              <Link to="/women" onClick={closeMenu}>Women</Link>
              <Link to="/accessories" onClick={closeMenu}>Accessories</Link>
              <Link to="/wishlist" onClick={closeMenu}>Wishlist</Link>

              {user && (
                <Link to="/my-orders" onClick={closeMenu}>
                  My Orders
                </Link>
              )}

              {isAdmin && !isLoadingRole && (
                <Link to="/admin/dashboard" onClick={closeMenu}>
                  Admin Dashboard
                </Link>
              )}

              <Link to="/contact" onClick={closeMenu}>Contact</Link>

              <Link to="/cart" onClick={closeMenu}>
                Cart ({itemCount})
              </Link>

              {/* AUTH */}
              {user ? (
                <>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <button onClick={handleLogout} className="bg-gray-200 py-2 rounded">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu}>Login</Link>
                  <Link to="/signup" onClick={closeMenu} className="bg-pink-500 text-white py-2 text-center rounded">
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CART */}
      <Link
        to="/cart"
        className="fixed right-5 bottom-20 z-40 md:hidden bg-pink-500 text-white p-3 rounded-full shadow-lg"
      >
        🛒
      </Link>
    </>
  );
};

export default Navbar;
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // 🔄 Load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      if (saved) setWishlist(JSON.parse(saved));
    } catch (err) {
      console.error("Wishlist load error:", err);
    }
  }, []);

  // 💾 Save
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch (err) {
      console.error("Wishlist save error:", err);
    }
  }, [wishlist]);

  // ❤️ ADD
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  // ❌ REMOVE
  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  // 🔄 TOGGLE (🔥 IMPORTANT)
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // 🔍 CHECK
  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  // 📊 COUNT (🔥 useful in navbar later)
  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,   // 🔥 NEW
        isInWishlist,     // 🔥 NEW
        wishlistCount,    // 🔥 NEW
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
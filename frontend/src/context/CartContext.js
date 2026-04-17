import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 🔄 Load cart
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error("Cart load error:", err);
    }
  }, []);

  // 💾 Save cart
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (err) {
      console.error("Cart save error:", err);
    }
  }, [cartItems]);

  // 🛒 ADD
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, 10), // 🔒 limit
              }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ❌ REMOVE
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 🔄 UPDATE QTY
  const updateQuantity = (id, qty) => {
    if (qty < 1) return; // ❌ block invalid

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(qty, 10),
            }
          : item
      )
    );
  };

  // 🧹 CLEAR
  const clearCart = () => {
    setCartItems([]);
  };

  // 💰 TOTALS (IMPORTANT 🔥)
  const totals = useMemo(() => {
    const totalUSD = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const totalItems = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const totalINR = Math.round(totalUSD * 83.5);

    return {
      totalUSD,
      totalINR,
      totalItems,
    };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totals, // 🔥 NEW
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
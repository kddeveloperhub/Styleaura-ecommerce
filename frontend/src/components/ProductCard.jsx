import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ id, name, price, image, isNew = true }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  // 💸 Discount
  const originalINR = Math.round(price * 83.5);
  const discountedPrice = price * 0.95;
  const inrPrice = Math.round(discountedPrice * 83.5);

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="bg-white rounded-xl shadow-md overflow-hidden group relative cursor-pointer hover:shadow-lg transition"
    >
      {/* 🖼 Image */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          onError={(e) => (e.target.src = "/fallback.jpg")}
          className="h-80 w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* 🆕 Badge */}
        {isNew && (
          <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
            New
          </span>
        )}

        {/* ❤️ Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToWishlist({ id, name, price, image });
          }}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-pink-100"
        >
          ❤️
        </button>
      </div>

      {/* 📦 Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{name}</h3>

        {/* ⭐ Fake Rating */}
        <div className="text-yellow-400 text-sm mb-2">
          ★★★★☆ <span className="text-gray-500 text-xs">(120)</span>
        </div>

        {/* 💰 Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-pink-500 font-bold text-lg">
              ₹{inrPrice}
            </span>
            <span className="text-gray-400 line-through text-sm ml-2">
              ₹{originalINR}
            </span>
          </div>

          {/* 🛒 Add */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ id, name, price, image });
            }}
            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded text-sm transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
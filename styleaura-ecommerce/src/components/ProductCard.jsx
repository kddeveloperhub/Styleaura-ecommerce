import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ id, name, price, image }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Reduce price slightly & convert to INR
  const discountedPrice = price * 0.95; // 5% discount
  const inrPrice = (discountedPrice * 83.5).toFixed(0); // Convert to INR

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden group relative cursor-pointer"
    >
      <a
        href={image}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()} // Prevent card navigation when image clicked
      >
        <img
          src={image}
          alt={name}
          className="h-80 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </a>

      <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
        New
      </span>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-pink-500 font-bold">₹{inrPrice}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ id, name, price, image }); // Still using original USD internally
            }}
            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

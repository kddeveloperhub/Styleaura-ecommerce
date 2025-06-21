import React from 'react';
import { useParams } from 'react-router-dom';
import { menProducts, womenProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist(); 
  const productId = parseInt(id);

  const allProducts = [...menProducts, ...womenProducts];
  const product = allProducts.find((item) => item.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-2xl font-semibold text-gray-600">Product not found.</p>
      </div>
    );
  }

  const inrPrice = Math.round(product.price * 83.5); // ✅ Convert USD to INR

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-pink-500 text-2xl font-semibold">₹{inrPrice}</p> {/* ✅ INR Display */}
          <p className="text-gray-600 text-sm">
            Experience luxury fashion tailored for your lifestyle. This product is crafted with the finest fabrics and thoughtful details to elevate your look.
          </p>
          <div className="flex gap-4 pt-6">
            <button
              onClick={() => addToCart(product)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
            >
              Add to Cart
            </button>
            <button
              onClick={() => addToWishlist(product)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition duration-300"
            >
              Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

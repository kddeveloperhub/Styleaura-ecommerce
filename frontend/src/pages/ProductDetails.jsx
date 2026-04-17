import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { menProducts, womenProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const productId = parseInt(id);
  const allProducts = [...menProducts, ...womenProducts];
  const product = allProducts.find((item) => item.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-2xl font-semibold text-gray-600">
          Product not found.
        </p>
      </div>
    );
  }

  const inrPrice = Math.round(product.price * 83.5);

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div className="overflow-hidden rounded-xl shadow-lg group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[500px] object-cover transition duration-500 group-hover:scale-110"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-6">

          <h1 className="text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="text-pink-500 text-3xl font-bold">
            ₹{inrPrice}
          </p>

          <p className="text-gray-600 text-sm leading-relaxed">
            Experience luxury fashion tailored for your lifestyle. Crafted with
            premium fabrics and modern design to elevate your everyday look.
          </p>

          {/* SIZE */}
          <div>
            <h3 className="font-semibold mb-2">Select Size</h3>
            <div className="flex gap-3">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg ${
                    selectedSize === size
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div>
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="flex items-center border w-max rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-lg"
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* INFO */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>Category: Fashion</p>
            <p>Status: In Stock</p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-4 flex-wrap">
            <button
              onClick={() =>
                addToCart({ ...product, quantity })
              }
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Add to Cart
            </button>

            <button
              onClick={() => addToWishlist(product)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition"
            >
              ❤️ Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* EXTRA SECTION */}
      <div className="max-w-5xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-4">Product Description</h2>
        <p className="text-gray-600 leading-relaxed">
          This piece combines comfort and style effortlessly. Designed for modern
          individuals who value quality and elegance, it is perfect for both
          casual and formal occasions.
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            Your Wishlist ❤️
          </h2>
          {wishlist.length > 0 && (
            <span className="text-gray-500 text-sm">
              {wishlist.length} items
            </span>
          )}
        </div>

        {/* EMPTY STATE */}
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-3">
              Your Wishlist is Empty 💔
            </h3>
            <p className="text-gray-500 mb-6">
              Save items you love to your wishlist
            </p>
            <Link
              to="/"
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {wishlist.map((item) => {
                const inrPrice = Math.round(item.price * 83.5);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group"
                  >
                    {/* IMAGE */}
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                      />

                      {/* REMOVE BUTTON */}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-100"
                      >
                        ❌
                      </button>
                    </div>

                    {/* CONTENT */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-1">
                        {item.name}
                      </h3>

                      <p className="text-pink-500 font-bold mb-4">
                        ₹{inrPrice}
                      </p>

                      {/* ACTIONS */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(item)}
                          className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg text-sm"
                        >
                          Add to Cart
                        </button>

                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="px-3 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FOOTER ACTION */}
            <div className="mt-10 text-center">
              <Link
                to="/"
                className="text-pink-500 hover:underline"
              >
                ← Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
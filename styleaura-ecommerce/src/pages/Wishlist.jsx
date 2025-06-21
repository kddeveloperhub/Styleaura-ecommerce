import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Your Wishlist</h2>
        {wishlist.length === 0 ? (
          <p className="text-gray-600">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {wishlist.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg shadow-sm">
                <img src={item.image} alt={item.name} className="w-full h-60 object-cover rounded mb-4" />
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-pink-500 font-bold mb-2">${item.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

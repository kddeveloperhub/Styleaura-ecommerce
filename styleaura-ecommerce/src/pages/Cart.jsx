import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const usdTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const inrTotal = (usdTotal * 83.5).toFixed(0); // conversion rate

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-600 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <p className="mb-6">Looks like you haven’t added anything yet.</p>
        <Link to="/men" className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

        {/* Cart Items */}
        <div className="space-y-6">
          {cartItems.map((item) => {
            const inrPrice = (item.price * 83.5).toFixed(0);
            return (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">₹{inrPrice}</p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center gap-4">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-2 py-1 text-lg font-semibold"
                    >−</button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value);
                        if (qty >= 1) updateQuantity(item.id, qty);
                      }}
                      className="w-12 text-center border-l border-r outline-none"
                      min="1"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-lg font-semibold"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total & Actions */}
        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xl font-semibold">
            Total: <span className="text-pink-600">₹{inrTotal}</span>
          </div>
          <div className="flex gap-4 flex-wrap justify-end">
            <button
              onClick={clearCart}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Clear Cart
            </button>
            <Link
              to="/checkout"
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

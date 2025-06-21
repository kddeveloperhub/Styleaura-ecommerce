import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const usdTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const inrTotal = Math.round(usdTotal * 83.5);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: cartItems,
          total: usdTotal,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('✅ Order placed successfully!');
        localStorage.setItem('lastOrder', JSON.stringify({
          ...form,
          items: cartItems,
          total: usdTotal,
        }));
        clearCart();
        setTimeout(() => {
          navigate(`/payment/${inrTotal}`);
        }, 1500);
      } else {
        toast.error(data.message || '❌ Failed to place order.');
      }
    } catch (err) {
      console.error('Order error:', err);
      toast.error('🚫 Order submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="min-h-screen bg-white px-4 py-10 font-sans">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-pink-600">🛒 Checkout</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          <>
            {/* Order Summary */}
            <div className="mb-8 border rounded p-4 bg-gray-50">
              <h3 className="text-xl font-semibold mb-2 text-[#1d3557]">Order Summary</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatINR(item.price * 83.5 * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="text-right font-bold mt-3 text-lg text-pink-600">
                Total: {formatINR(inrTotal)}
              </div>
            </div>

            {/* Billing Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="w-full border px-4 py-2 rounded" />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border px-4 py-2 rounded" />
              <input type="tel" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="w-full border px-4 py-2 rounded" />
              <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="w-full border px-4 py-2 rounded" />

              <div className="flex flex-col sm:flex-row gap-4">
                <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required className="w-full border px-4 py-2 rounded" />
                <input type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} required className="w-full border px-4 py-2 rounded" />
                <input type="text" name="zip" placeholder="ZIP Code" value={form.zip} onChange={handleChange} required className="w-full border px-4 py-2 rounded" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded text-lg font-semibold disabled:opacity-60"
              >
                {isSubmitting ? 'Placing Order...' : `Place Order & Pay ${formatINR(inrTotal)}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;

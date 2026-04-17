import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { placeOrder } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  // 🔥 Auto-fill user email if logged in
  useEffect(() => {
    if (user?.email) {
      setForm((prev) => ({
        ...prev,
        email: user.email,
      }));
    }
  }, [user]);

  const usdTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const inrTotal = Math.round(usdTotal * 83.5);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error("Please fill all required fields");
      return false;
    }

    if (form.phone.length < 10) {
      toast.error("Invalid phone number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      return toast.error('Cart is empty');
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const orderData = {
        ...form,
        items: cartItems,
        total: usdTotal,
        totalINR: inrTotal,
      };

      const res = await placeOrder(orderData);

      if (res.success) {
        toast.success('✅ Order placed successfully!');

        // 🔥 Save for invoice / confirmation
        localStorage.setItem('lastOrder', JSON.stringify(orderData));

        clearCart();

        // 🔥 Navigate with ORDER ID (IMPORTANT)
        setTimeout(() => {
          navigate(`/payment/${res.id}`);
        }, 1200);

      } else {
        toast.error(res.error || '❌ Failed to place order');
      }

    } catch (err) {
      console.error(err);
      toast.error('🚫 Something went wrong');
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
        <h2 className="text-3xl font-bold mb-6 text-pink-600">
          🛒 Checkout
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          <>
            {/* 🧾 Order Summary */}
            <div className="mb-8 border rounded p-4 bg-gray-50">
              <h3 className="text-xl font-semibold mb-2 text-[#1d3557]">
                Order Summary
              </h3>

              <ul className="space-y-2 text-sm text-gray-700">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>
                      {formatINR(item.price * 83.5 * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="text-right font-bold mt-3 text-lg text-pink-600">
                Total: {formatINR(inrTotal)}
              </div>
            </div>

            {/* 🧾 Billing Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded"
              />

              <textarea
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded"
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full border px-4 py-2 rounded"
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="w-full border px-4 py-2 rounded"
                />

                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP Code"
                  value={form.zip}
                  onChange={handleChange}
                  required
                  className="w-full border px-4 py-2 rounded"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded text-lg font-semibold disabled:opacity-60"
              >
                {isSubmitting
                  ? 'Placing Order...'
                  : `Place Order & Pay ${formatINR(inrTotal)}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
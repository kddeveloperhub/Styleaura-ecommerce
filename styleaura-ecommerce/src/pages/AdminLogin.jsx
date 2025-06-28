import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = process.env.REACT_APP_API_URL || 'https://styleaura-ecommerce.onrender.com';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef(null);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Required for session cookies
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || 'Invalid credentials');
        return;
      }

      toast.success('Login successful');
      setTimeout(() => navigate('/admin/orders'), 1000);
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Network error or CORS issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-md rounded-lg w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">
          Admin Login
        </h2>

        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input
          ref={emailRef}
          type="email"
          name="email"
          placeholder="admin@styleaura.com"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-4 py-2 mb-4 rounded focus:outline-pink-500"
          required
        />

        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          placeholder="********"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-4 py-2 mb-6 rounded focus:outline-pink-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

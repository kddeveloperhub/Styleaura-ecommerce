import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Use environment variable or Render fallback
const API_BASE = process.env.REACT_APP_API_URL || 'https://styleaura-ecommerce.onrender.com';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || 'Login failed');
        throw new Error(data.message || 'Login failed');
      }

      toast.success('Login successful');
      setTimeout(() => navigate('/admin/orders'), 1200);
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Server error or network issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-md rounded w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">
          Admin Login
        </h2>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          autoComplete="username"
          className="w-full border px-4 py-2 mb-4 rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          autoComplete="current-password"
          className="w-full border px-4 py-2 mb-6 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

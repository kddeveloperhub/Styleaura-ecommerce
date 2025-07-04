import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaShoppingCart,
  FaRupeeSign,
  FaClock,
  FaCheckCircle,
  FaBoxOpen,
  FaSignOutAlt,
} from 'react-icons/fa';

const API_BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://styleaura-ecommerce.onrender.com';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();

  // ✅ Check if admin and fetch analytics
  useEffect(() => {
    fetch(`${API_BASE}/api/admin/analytics`, {
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 401) {
          toast.error('Unauthorized. Please log in again.');
          navigate('/admin/login');
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then((data) => {
        if (data) setAnalytics(data);
      })
      .catch((err) => {
        toast.error('Failed to load analytics');
        console.error(err);
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      toast.success('Logged out');
      navigate('/admin/login');
    } catch (err) {
      toast.error('Logout failed');
      console.error(err);
    }
  };

  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount * 83.5);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <p>Loading analytics...</p>
      </div>
    );
  }

  const { totalOrders, totalSales, statusCount, topProducts } = analytics;

  const cards = [
    {
      icon: <FaShoppingCart className="text-2xl text-pink-600" />,
      title: 'Total Orders',
      value: totalOrders || 0,
    },
    {
      icon: <FaRupeeSign className="text-2xl text-green-600" />,
      title: 'Total Sales',
      value: formatINR(totalSales || 0),
    },
    {
      icon: <FaClock className="text-2xl text-yellow-500" />,
      title: 'Pending Orders',
      value: statusCount?.Pending || 0,
    },
    {
      icon: <FaCheckCircle className="text-2xl text-green-600" />,
      title: 'Delivered Orders',
      value: statusCount?.Delivered || 0,
    },
  ];

  return (
    <div className="min-h-screen px-4 py-10 bg-white text-[#1d3557] relative">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      {/* ✅ Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        <FaSignOutAlt /> Logout
      </button>

      <h2 className="text-3xl font-bold mb-10 text-center text-pink-600">
        📊 Admin Dashboard
      </h2>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-all duration-300 border border-gray-200"
          >
            <div className="flex items-center justify-center mb-4">{card.icon}</div>
            <h3 className="text-lg font-semibold text-center mb-2">{card.title}</h3>
            <p className="text-2xl font-bold text-center">{card.value}</p>
          </div>
        ))}
      </div>

      {/* ✅ Top Products */}
      <div className="bg-[#f8fafc] p-6 rounded-xl shadow max-w-3xl mx-auto border border-gray-200">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-pink-600">
          <FaBoxOpen /> Top Products
        </h3>
        <ul className="space-y-2">
          {topProducts?.length > 0 ? (
            topProducts.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between border-b border-gray-200 pb-2"
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-pink-600 font-semibold">× {item.quantity}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No top products data available.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;

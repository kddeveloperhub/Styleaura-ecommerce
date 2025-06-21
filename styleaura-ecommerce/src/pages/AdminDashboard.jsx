import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// 👇 This makes it work on both desktop and mobile
const API_BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : `http://${window.location.hostname}:5000`;

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/analytics`, {
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 401) {
          toast.error('Unauthorized');
          navigate('/admin/login');
          throw new Error('Unauthorized'); // Properly stop execution
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          console.log('Analytics Data:', data); // Optional: Debug
          setAnalytics(data);
        }
      })
      .catch((err) => {
        toast.error('Failed to load analytics');
        console.error(err);
      });
  }, [navigate]);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <p>Loading analytics...</p>
      </div>
    );
  }

  const { totalOrders, totalSales, statusCount, topProducts } = analytics;
  const totalSalesINR = Math.round(totalSales * 83.5);

  return (
    <div className="min-h-screen px-4 py-10 bg-white">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <h2 className="text-3xl font-bold mb-6 text-center text-pink-600">📊 Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 text-center">
        <div className="bg-gray-100 p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl font-bold text-pink-600">{totalOrders}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Total Sales</h3>
          <p className="text-2xl font-bold text-pink-600">₹{totalSalesINR}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Pending</h3>
          <p className="text-2xl font-bold text-yellow-500">{statusCount?.Pending || 0}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Delivered</h3>
          <p className="text-2xl font-bold text-green-600">{statusCount?.Delivered || 0}</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">📈 Top Products</h3>
      <ul className="bg-gray-50 p-4 rounded shadow space-y-2">
        {topProducts?.length > 0 ? (
          topProducts.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{item.name}</span>
              <span className="font-semibold text-pink-500">× {item.quantity}</span>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No top products data</li>
        )}
      </ul>
    </div>
  );
};

export default AdminDashboard;

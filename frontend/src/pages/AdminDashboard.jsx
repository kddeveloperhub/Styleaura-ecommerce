import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaRupeeSign,
  FaClock,
  FaCheckCircle,
  FaBoxOpen,
  FaSignOutAlt,
} from "react-icons/fa";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";



import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();

  // 🔐 AUTH CHECK
  useEffect(() => {
    if (loading) return;

    if (!user) navigate("/login");
    else if (role !== "admin") {
      toast.error("Access denied");
      navigate("/");
    }
  }, [user, role, loading, navigate]);

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "orders"));
        const orders = snapshot.docs.map((doc) => doc.data());

        const totalOrders = orders.length;

        const totalSales = orders.reduce(
          (sum, o) => sum + (o.totalINR || 0),
          0
        );

        const statusCount = {};
        const productMap = {};
        const salesByDay = {};

        orders.forEach((order) => {
          const status = order.status || "Pending";
          statusCount[status] = (statusCount[status] || 0) + 1;

          const date = order.createdAt?.seconds
            ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
            : "Unknown";

          salesByDay[date] = (salesByDay[date] || 0) + (order.totalINR || 0);

          order.items?.forEach((item) => {
            if (!productMap[item.name]) {
              productMap[item.name] = { name: item.name, quantity: 0 };
            }
            productMap[item.name].quantity += item.quantity;
          });
        });

        const topProducts = Object.values(productMap)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        const chartData = Object.entries(salesByDay).map(([date, value]) => ({
          date,
          value,
        }));

        setAnalytics({
          totalOrders,
          totalSales,
          statusCount,
          topProducts,
          chartData,
        });

      } catch (err) {
        console.error(err);
        toast.error("Failed to load analytics");
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <p className="animate-pulse text-lg">Loading dashboard...</p>
      </div>
    );
  }

  const { totalOrders, totalSales, statusCount, topProducts} = analytics;

  const cards = [
    {
      icon: <FaShoppingCart />,
      title: "Orders",
      value: totalOrders,
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: <FaRupeeSign />,
      title: "Revenue",
      value: formatINR(totalSales),
      color: "from-green-500 to-green-600",
    },
    {
      icon: <FaClock />,
      title: "Pending",
      value: statusCount?.Pending || 0,
      color: "from-yellow-400 to-yellow-500",
    },
    {
      icon: <FaCheckCircle />,
      title: "Delivered",
      value: statusCount?.Delivered || 0,
      color: "from-blue-500 to-blue-600",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-gray-100 to-white relative">

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
      >
        <FaSignOutAlt /> Logout
      </button>

      <h2 className="text-4xl font-bold text-center mb-12 text-pink-600">
        📊 Admin Dashboard
      </h2>

      {/* CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-r ${card.color} text-white p-6 rounded-xl shadow-lg hover:scale-105 transition`}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <h3>{card.title}</h3>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow mb-12">
        <h3 className="text-xl font-bold mb-4 text-pink-600">
          📈 Revenue Trend
        </h3>

        
      </div>

      {/* TOP PRODUCTS */}
      <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
        <h3 className="text-xl font-bold mb-4 text-pink-600 flex items-center gap-2">
          <FaBoxOpen /> Top Products
        </h3>

        <ul className="space-y-2">
          {topProducts.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between border-b pb-2"
            >
              <span>{item.name}</span>
              <span className="text-pink-600 font-semibold">
                × {item.quantity}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
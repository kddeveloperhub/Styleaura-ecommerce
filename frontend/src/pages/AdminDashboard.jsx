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

    if (!user) {
      navigate("/login");
    } else if (role !== "admin") {
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

        orders.forEach((order) => {
          const status = order.status || "Pending";
          statusCount[status] = (statusCount[status] || 0) + 1;

          order.items?.forEach((item) => {
            if (!productMap[item.name]) {
              productMap[item.name] = {
                name: item.name,
                quantity: 0,
              };
            }
            productMap[item.name].quantity += item.quantity;
          });
        });

        const topProducts = Object.values(productMap)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        setAnalytics({
          totalOrders,
          totalSales,
          statusCount,
          topProducts,
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

  // ⏳ LOADING
  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <p className="animate-pulse text-lg">Loading dashboard...</p>
      </div>
    );
  }

  const { totalOrders, totalSales, statusCount, topProducts } = analytics;

  const cards = [
    {
      icon: <FaShoppingCart />,
      title: "Total Orders",
      value: totalOrders,
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: <FaRupeeSign />,
      title: "Total Sales",
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
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-gray-100 to-white text-[#1d3557] relative">

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      {/* 🔓 Logout */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition hover:scale-105"
      >
        <FaSignOutAlt /> Logout
      </button>

      <h2 className="text-4xl font-extrabold mb-12 text-center text-pink-600 tracking-wide">
        🚀 Admin Dashboard
      </h2>

      {/* 📊 CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-r ${card.color} text-white p-6 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl`}
          >
            <div className="text-3xl mb-3 opacity-90">{card.icon}</div>
            <h3 className="text-lg font-medium">{card.title}</h3>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* 🏆 TOP PRODUCTS */}
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto border">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-pink-600">
          <FaBoxOpen /> Top Selling Products
        </h3>

        <ul className="space-y-4">
          {topProducts.length > 0 ? (
            topProducts.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-pink-600 font-semibold">
                  × {item.quantity}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No data</li>
          )}
        </ul>
      </div>

      {/* ✨ EXTRA ANIMATION STYLE */}
      <style>
        {`
          .fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;
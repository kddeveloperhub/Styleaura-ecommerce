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
import { db, auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";

import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);

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

        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(ordersData);

        const totalOrders = ordersData.length;

        const totalSales = ordersData.reduce(
          (sum, o) => sum + (o.totalINR || 0),
          0
        );

        const statusCount = {};
        const productMap = {};

        ordersData.forEach((order) => {
          const status = order.status || "Pending";
          statusCount[status] = (statusCount[status] || 0) + 1;

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

        setAnalytics({
          totalOrders,
          totalSales,
          statusCount,
          topProducts,
        });

      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      }
    };

    fetchOrders();
  }, []);

  // 🔥 UPDATE STATUS
  const updateStatus = async (id, field, value) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      await fetch(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          [field]: value,
        }),
      });

      // 🔄 UI update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, [field]: value } : o
        )
      );

    } catch (err) {
      console.error("Update error:", err);
    }
  };

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
        Loading dashboard...
      </div>
    );
  }

  const { totalOrders, totalSales, statusCount, topProducts } = analytics;

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100 relative">

      <ToastContainer position="top-center" autoClose={3000} />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-pink-600 text-white px-4 py-2 rounded"
      >
        <FaSignOutAlt /> Logout
      </button>

      <h2 className="text-4xl font-bold text-center mb-10 text-pink-600">
        📊 Admin Dashboard
      </h2>

      {/* CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-pink-500 text-white p-6 rounded">
          <FaShoppingCart />
          <p>Orders</p>
          <h2>{totalOrders}</h2>
        </div>

        <div className="bg-green-500 text-white p-6 rounded">
          <FaRupeeSign />
          <p>Revenue</p>
          <h2>{formatINR(totalSales)}</h2>
        </div>

        <div className="bg-yellow-400 text-white p-6 rounded">
          <FaClock />
          <p>Pending</p>
          <h2>{statusCount?.Pending || 0}</h2>
        </div>

        <div className="bg-blue-500 text-white p-6 rounded">
          <FaCheckCircle />
          <p>Delivered</p>
          <h2>{statusCount?.Delivered || 0}</h2>
        </div>
      </div>

      {/* 🔥 MANAGE ORDERS */}
      <div className="bg-white p-6 rounded shadow mb-10">
        <h3 className="text-xl font-bold mb-4 text-pink-600">
          📦 Manage Orders
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pink-500 text-white">
              <tr>
                <th className="p-2">Customer</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Payment</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">

                  <td className="p-2">
                    <p>{order.name}</p>
                    <small>{order.email}</small>
                  </td>

                  <td className="p-2 text-pink-600">
                    ₹{order.totalINR}
                  </td>

                  <td className="p-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, "status", e.target.value)
                      }
                    >
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </td>

                  <td className="p-2">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) =>
                        updateStatus(
                          order.id,
                          "paymentStatus",
                          e.target.value
                        )
                      }
                    >
                      <option>Pending</option>
                      <option>Paid</option>
                    </select>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOP PRODUCTS */}
      <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
        <h3 className="text-xl font-bold mb-4 text-pink-600">
          <FaBoxOpen /> Top Products
        </h3>

        {topProducts.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span>{item.name}</span>
            <span>× {item.quantity}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminDashboard;
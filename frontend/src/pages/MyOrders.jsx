import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // 🔥 FETCH ORDERS
  // =========================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setOrders(data);
      } catch (err) {
        console.error("❌ Fetch Orders Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // =========================
  // 💰 FORMAT INR
  // =========================
  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  // =========================
  // 📅 FORMAT DATE
  // =========================
  const formatDate = (createdAt) => {
    if (!createdAt) return "N/A";

    if (createdAt.seconds) {
      return new Date(createdAt.seconds * 1000).toLocaleDateString();
    }

    if (createdAt._seconds) {
      return new Date(createdAt._seconds * 1000).toLocaleDateString();
    }

    return new Date(createdAt).toLocaleDateString();
  };

  // =========================
  // 🎨 STATUS COLOR
  // =========================
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "Shipped":
        return "bg-purple-100 text-purple-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100";
    }
  };

  // =========================
  // 🚚 PROGRESS BAR
  // =========================
  const getStep = (status) => {
    switch (status) {
      case "Pending":
        return 1;
      case "Confirmed":
        return 2;
      case "Shipped":
        return 3;
      case "Delivered":
        return 4;
      default:
        return 1;
    }
  };

  // =========================
  // ⏳ LOADING
  // =========================
  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-white">
      <h2 className="text-3xl font-bold text-center text-pink-600 mb-8">
        📦 My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">
          You have no orders yet.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {orders.map((order) => {
            const step = getStep(order.status);

            return (
              <div
                key={order.id}
                className="border rounded-xl p-5 shadow hover:shadow-md transition"
              >
                {/* HEADER */}
                <div className="flex justify-between mb-3">
                  <p className="font-semibold text-sm">
                    Order ID: {order.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                {/* ITEMS */}
                <div className="space-y-1 text-sm text-gray-700">
                  {order.items?.map((item, i) => (
                    <p key={i}>
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>

                {/* PROGRESS BAR */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Pending</span>
                    <span>Confirmed</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-pink-500 h-2 rounded transition-all"
                      style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* TOTAL + STATUS */}
                <div className="mt-4 flex justify-between items-center">
                  <p className="font-bold text-pink-600">
                    {formatINR(order.totalINR)}
                  </p>

                  <div className="flex gap-2 items-center text-xs">

                    {/* STATUS */}
                    <span
                      className={`px-2 py-1 rounded ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    {/* PAYMENT */}
                    <span
                      className={`px-2 py-1 rounded ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
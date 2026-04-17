import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // 🔥 FETCH FROM BACKEND
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

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

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
  // 💰 FORMAT INR (USED NOW ✅)
  // =========================
  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  // =========================
  // 📅 SAFE DATE FORMAT
  // =========================
  const formatDate = (createdAt) => {
    if (!createdAt) return "N/A";

    // Firestore Timestamp
    if (createdAt.seconds) {
      return new Date(createdAt.seconds * 1000).toLocaleDateString();
    }

    // JS Date (backend)
    if (createdAt._seconds) {
      return new Date(createdAt._seconds * 1000).toLocaleDateString();
    }

    // ISO string fallback
    return new Date(createdAt).toLocaleDateString();
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
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-5 shadow-sm"
            >
              {/* HEADER */}
              <div className="flex justify-between mb-3">
                <p className="font-semibold">Order ID: {order.id}</p>
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

              {/* TOTAL + STATUS */}
              <div className="mt-3 flex justify-between items-center">
                <p className="font-bold text-pink-600">
                  {formatINR(order.totalINR)}
                </p>

                <div className="text-sm">
                  <span className="mr-3">
                    Status: <strong>{order.status}</strong>
                  </span>
                  <span>
                    Payment: <strong>{order.paymentStatus}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
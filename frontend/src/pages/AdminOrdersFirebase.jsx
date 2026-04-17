import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // 🔥 FETCH ORDERS
  // =========================
  const fetchOrders = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

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

      if (!res.ok) {
        throw new Error(data.message || "Failed");
      }

      setOrders(data);

    } catch (err) {
      console.error("❌ Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // 🔥 UPDATE STATUS
  // =========================
  const updateStatus = async (id, field, value) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      await fetch(
        `${process.env.REACT_APP_API_URL}/api/orders/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            [field]: value,
          }),
        }
      );

      fetchOrders();

    } catch (err) {
      console.error("❌ Update Error:", err);
    }
  };

  // =========================
  // 🎨 STATUS BADGE
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

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">
        📦 Admin Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg shadow">
            <thead className="bg-pink-500 text-white">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">

                  {/* CUSTOMER */}
                  <td className="p-3">
                    <p className="font-semibold">{order.name}</p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                  </td>

                  {/* ITEMS */}
                  <td className="p-3 text-sm">
                    {order.items?.map((item, i) => (
                      <div key={i}>
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                  </td>

                  {/* AMOUNT */}
                  <td className="p-3 font-semibold text-pink-600">
                    ₹{order.totalINR || 0}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs mr-2 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, "status", e.target.value)
                      }
                      className="border px-2 py-1 rounded text-sm"
                    >
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </td>

                  {/* PAYMENT */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>

                    {/* 🔒 disable manual change if paid */}
                    {order.paymentStatus !== "Paid" && (
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          updateStatus(
                            order.id,
                            "paymentStatus",
                            e.target.value
                          )
                        }
                        className="border px-2 py-1 rounded text-sm mt-1"
                      >
                        <option>Pending</option>
                        <option>Paid</option>
                      </select>
                    )}
                  </td>

                  {/* DATE */}
                  <td className="p-3 text-sm text-gray-500">
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
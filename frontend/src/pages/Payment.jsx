import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // =========================
  // 🔥 FETCH ORDER (SECURE)
  // =========================
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();

        const res = await fetch("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch order");
        }

        const foundOrder = data.find((o) => o.id === orderId);

        if (!foundOrder) {
          alert("Order not found");
          return;
        }

        setOrder(foundOrder);
      } catch (err) {
        console.error("❌ Fetch Order Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // =========================
  // 💳 HANDLE PAYMENT
  // =========================
  const handlePayment = async () => {
    try {
      setPaying(true);

      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      // 🔥 SEND ONLY orderId (SECURE)
      const res = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: orderId, // ✅ FIXED
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Payment init failed");
      }

      const razorpayOrder = data.order;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "StyleAura",
        description: "Order Payment",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              "http://localhost:5000/api/payment/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  ...response,
                  orderId: orderId,
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              alert("✅ Payment Successful");

              localStorage.setItem("lastOrderId", orderId);

              navigate("/order-confirmation");
            } else {
              alert("❌ Payment verification failed");
            }
          } catch (err) {
            console.error("❌ Verify Error:", err);
            alert("Verification failed");
          }
        },

        theme: {
          color: "#ec4899",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("❌ Payment Error:", err);
      alert("Payment failed");
    } finally {
      setPaying(false);
    }
  };

  // =========================
  // ⏳ LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold mb-4">Complete Payment</h1>

      <p className="mb-4 text-gray-600">
        Amount: ₹{order.totalINR}
      </p>

      <button
        onClick={handlePayment}
        disabled={paying}
        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded disabled:opacity-60"
      >
        {paying ? "Processing..." : `Pay ₹${order.totalINR}`}
      </button>
    </div>
  );
};

export default Payment;
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const { db } = require("../config/firebase");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ======================
// 🔥 CREATE ORDER (SECURE + DUPLICATE SAFE)
// ======================
router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID required" });
    }

    const orderRef = db.collection("orders").doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderData = orderDoc.data();

    // 🔐 OWNER CHECK
    if (orderData.userId !== req.user.uid) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ❌ PREVENT DOUBLE PAYMENT
    if (orderData.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Already paid" });
    }

    const amount = orderData.totalINR;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${orderId}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 💾 SAVE RAZORPAY ORDER ID
    await orderRef.update({
      razorpayOrderId: razorpayOrder.id,
    });

    return res.json({
      success: true,
      order: razorpayOrder,
    });

  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ success: false });
  }
});


// ======================
// 🔥 VERIFY PAYMENT (STRICT + SAFE)
// ======================
router.post("/verify", verifyToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (!orderId || !razorpay_payment_id) {
      return res.status(400).json({ success: false });
    }

    const orderRef = db.collection("orders").doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ success: false });
    }

    const orderData = orderDoc.data();

    // 🔐 OWNER CHECK
    if (orderData.userId !== req.user.uid) {
      return res.status(403).json({ success: false });
    }

    // 🔐 ORDER MATCH CHECK
    if (orderData.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ success: false });
    }

    // ❌ PREVENT DOUBLE VERIFY
    if (orderData.paymentStatus === "Paid") {
      return res.json({ success: true }); // already paid
    }

    // 🔐 SIGNATURE VERIFY
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    // ✅ UPDATE ORDER
    await orderRef.update({
      paymentStatus: "Paid",
      razorpayPaymentId: razorpay_payment_id,
      paidAt: new Date(),
    });

    return res.json({ success: true });

  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
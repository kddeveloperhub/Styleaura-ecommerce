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
// 🔥 CREATE ORDER
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

    if (orderData.userId !== req.user.uid) {
      return res.status(403).json({ message: "Unauthorized" });
    }

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
// 🔥 VERIFY PAYMENT
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

    if (orderData.userId !== req.user.uid) {
      return res.status(403).json({ success: false });
    }

    if (orderData.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ success: false });
    }

    if (orderData.paymentStatus === "Paid") {
      return res.json({ success: true });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    // ✅ FINAL UPDATE
    await orderRef.update({
      paymentStatus: "Paid",
      status: "Confirmed", // 🔥 ADDED
      razorpayPaymentId: razorpay_payment_id,
      paidAt: new Date(),
    });

    return res.json({ success: true });

  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({ success: false });
  }
});


// ======================
// 🔥 WEBHOOK (PRODUCTION SAFETY)
// ======================
router.post("/webhook", express.json({ type: "*/*" }), async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).send("Invalid signature");
    }

    const event = req.body.event;

    // ✅ PAYMENT SUCCESS
    if (event === "payment.captured") {
      const payment = req.body.payload.payment.entity;

      const razorpayOrderId = payment.order_id;

      const snapshot = await db
        .collection("orders")
        .where("razorpayOrderId", "==", razorpayOrderId)
        .get();

      snapshot.forEach(async (doc) => {
        await db.collection("orders").doc(doc.id).update({
          paymentStatus: "Paid",
          status: "Confirmed",
          razorpayPaymentId: payment.id,
          paidAt: new Date(),
        });
      });
    }

    // ❌ PAYMENT FAILED
    if (event === "payment.failed") {
      const payment = req.body.payload.payment.entity;

      const razorpayOrderId = payment.order_id;

      const snapshot = await db
        .collection("orders")
        .where("razorpayOrderId", "==", razorpayOrderId)
        .get();

      snapshot.forEach(async (doc) => {
        await db.collection("orders").doc(doc.id).update({
          paymentStatus: "Failed",
          status: "Cancelled",
        });
      });
    }

    return res.json({ status: "ok" });

  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).send("Webhook failed");
  }
});

module.exports = router;
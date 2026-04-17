const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const verifyToken = require("../middleware/authMiddleware");


// ======================
// 🔥 CREATE ORDER (SECURE)
// ======================
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, name, email, phone, address, city, state, zip } = req.body;

    // ❗ VALIDATION
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid items" });
    }

    // 🔥 CALCULATE TOTAL (DO NOT TRUST FRONTEND)
    let totalINR = 0;

    items.forEach((item) => {
      if (!item.price || !item.quantity) return;

      const itemTotal = Math.round(item.price * 83.5) * item.quantity;
      totalINR += itemTotal;
    });

    if (totalINR <= 0) {
      return res.status(400).json({ message: "Invalid total" });
    }

    const order = {
      userId: req.user.uid,
      userEmail: req.user.email,

      name,
      email,
      phone,
      address,
      city,
      state,
      zip,

      items,
      totalINR,

      status: "Pending",
      paymentStatus: "Pending",

      razorpayOrderId: null,
      razorpayPaymentId: null,

      createdAt: new Date(),
    };

    const docRef = await db.collection("orders").add(order);

    return res.json({
      success: true,
      orderId: docRef.id,
    });

  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ message: "Order failed" });
  }
});


// ======================
// 🔥 GET ORDERS (SECURE)
// ======================
router.get("/", verifyToken, async (req, res) => {
  try {
    let snapshot;

    // ✅ ADMIN → ALL ORDERS
    if (req.user.email === "admin@styleaura.com") {
      snapshot = await db.collection("orders").get();
    } 
    // ✅ USER → ONLY THEIR ORDERS
    else {
      snapshot = await db
        .collection("orders")
        .where("userId", "==", req.user.uid)
        .get();
    }

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(orders);

  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
});


// ======================
// 🔥 UPDATE ORDER (ADMIN ONLY)
// ======================
router.put("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.email !== "admin@styleaura.com") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allowedFields = ["status", "paymentStatus"];

    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    await db.collection("orders").doc(req.params.id).update(updates);

    res.json({ success: true });

  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
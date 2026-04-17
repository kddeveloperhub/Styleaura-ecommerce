const express = require('express');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

const cors = require("cors");

// ✅ CORS
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://styleaura00.netlify.app"
  ],
  credentials: true,
}));

// 🔥 IMPORTANT (Webhook ke liye — future safe)
app.use("/api/payment/webhook", express.raw({ type: "*/*" }));

// ✅ JSON parser
app.use(express.json());

// ✅ Routes
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('🔥 Firebase Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
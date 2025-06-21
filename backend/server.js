const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const Order = require('./models/Order');
dotenv.config();

const app = express();

// ✅ Dynamic CORS for localhost or LAN IP access
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://192.168.43.139:3000'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ✅ Session setup
app.use(session({
  secret: process.env.ADMIN_SECRET || 'admin-secret-key',
  resave: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,        // for local and LAN (no HTTPS)
    sameSite: 'lax',
  },
}));

const ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ✅ Ensure invoice directory exists
const invoiceDir = path.join(__dirname, 'invoices');
if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

// ✅ Middleware to protect admin routes
const requireAdmin = (req, res, next) => {
  if (req.session.admin) return next();
  return res.status(401).json({ message: 'Unauthorized' });
};

// ✅ Admin login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN.email && password === ADMIN.password) {
    req.session.admin = true;
    req.session.save(err => {
      if (err) {
        console.error('❌ Session save error:', err);
        return res.status(500).json({ success: false, message: 'Session error' });
      }
      console.log('✅ Admin logged in. Session:', req.session);
      return res.json({ success: true });
    });
  } else {
    console.log('❌ Invalid login attempt');
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// ✅ Admin logout
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// ✅ Newsletter route
app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;
  try {
    await axios.post(
      'https://api.brevo.com/v3/contacts',
      { email, listIds: [2], updateEnabled: true },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ success: true, message: 'Subscribed!' });
  } catch (err) {
    console.error('❌ Newsletter error:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Subscription failed' });
  }
});

// ✅ Generate invoice PDF
const generateInvoice = (order, filePath) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const inrTotal = Math.round(order.total * 83.5);

    doc.fontSize(20).text('StyleAura Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Customer: ${order.name}`);
    doc.text(`Email: ${order.email}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Address: ${order.address}, ${order.city}, ${order.state} ${order.zip}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.moveDown();
    doc.fontSize(14).text('Order Items:');

    order.items.forEach((item, i) => {
      const itemTotalInr = Math.round(item.price * item.quantity * 83.5);
      const unitInr = Math.round(item.price * 83.5);
      doc.text(`${i + 1}. ${item.name} × ${item.quantity} - ₹${itemTotalInr} (₹${unitInr} each)`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: ₹${inrTotal}`);
    doc.end();

    stream.on('finish', () => resolve(filePath));
  });
};

// ✅ Place order
app.post('/api/orders', async (req, res) => {
  try {
    console.log('📦 Incoming order:', req.body);

    const order = new Order({
      ...req.body,
      status: 'Pending',
      paymentStatus: 'Pending',
    });

    await order.save();

    const invoicePath = path.join(invoiceDir, `${order._id}.pdf`);
    await generateInvoice(order, invoicePath);

    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        to: [{ email: order.email, name: order.name }],
        sender: { name: 'StyleAura', email: process.env.SMTP_USER },
        subject: 'Order Confirmation - StyleAura',
        htmlContent: `
          <h3>Hello ${order.name},</h3>
          <p>Thanks for your order. Here's your invoice:</p>
          <ul>
            ${order.items.map(item => {
              const itemTotalInr = Math.round(item.price * item.quantity * 83.5);
              const unitInr = Math.round(item.price * 83.5);
              return `<li>${item.name} × ${item.quantity} - ₹${itemTotalInr} (₹${unitInr} each)</li>`;
            }).join('')}
          </ul>
          <p><strong>Total:</strong> ₹${Math.round(order.total * 83.5)}</p>
          <p>We'll deliver to: ${order.address}, ${order.city}, ${order.state} ${order.zip}</p>
          <p>- StyleAura Team</p>
        `,
        attachment: [
          {
            name: 'invoice.pdf',
            content: fs.readFileSync(invoicePath).toString('base64'),
          },
        ],
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(201).json({ success: true, orderId: order._id });
  } catch (err) {
    console.error('❌ Order processing error:', err);
    res.status(500).json({ success: false, message: 'Order failed.' });
  }
});

// ✅ Admin-only: fetch orders
app.get('/api/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

// ✅ Admin-only: update order status/payment
app.put('/api/orders/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updateFields = {};
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    await Order.findByIdAndUpdate(req.params.id, updateFields);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status.' });
  }
});

// ✅ Admin session check (used on frontend)
app.get('/api/admin/check', (req, res) => {
  console.log('Session data:', req.session);
  res.json({ isAdmin: !!req.session.admin });
});

// ✅ Admin dashboard analytics
app.get('/api/admin/analytics', requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);

    const statusCount = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const productMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productMap[item.name]) {
          productMap[item.name] = { name: item.name, quantity: 0 };
        }
        productMap[item.name].quantity += item.quantity;
      });
    });

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    res.json({ totalOrders, totalSales, statusCount, topProducts });
  } catch (err) {
    console.error('❌ Analytics Error:', err);
    res.status(500).json({ message: 'Failed to load analytics.' });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

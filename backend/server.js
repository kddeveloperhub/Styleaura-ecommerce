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

// === CORS CONFIG ===
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.43.139:3000',
  'https://styleaura00.netlify.app',
  'https://685f763--styleaura00.netlify.app',
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// === SESSION SETUP ===
app.use(session({
  secret: process.env.ADMIN_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
}));

// === CONNECT MONGO ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ Mongo error:', err));

// === INVOICE FOLDER SETUP ===
const invoiceDir = path.join(__dirname, 'invoices');
if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

// === ADMIN CREDENTIALS ===
const ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

// === ADMIN MIDDLEWARE ===
const requireAdmin = (req, res, next) => {
  if (req.session.admin) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

// === ROUTES ===

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN.email && password === ADMIN.password) {
    req.session.admin = true;
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// Session check
app.get('/api/admin/check', (req, res) => {
  res.json({ isAdmin: !!req.session.admin });
});

// Newsletter
app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  try {
    await axios.post('https://api.brevo.com/v3/contacts',
      { email, listIds: [2], updateEnabled: true },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Newsletter Error:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Subscription failed' });
  }
});

// Generate invoice
const generateInvoice = (order, filePath) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text('StyleAura Invoice', { align: 'center' }).moveDown();
    doc.fontSize(12)
      .text(`Name: ${order.name}`)
      .text(`Email: ${order.email}`)
      .text(`Phone: ${order.phone}`)
      .text(`Address: ${order.address}, ${order.city}, ${order.state}, ${order.zip}`)
      .moveDown().text('Items:');

    order.items.forEach((item, i) => {
      const price = Math.round(item.price * 83.5);
      doc.text(`${i + 1}. ${item.name} × ${item.quantity} = ₹${price * item.quantity}`);
    });

    doc.moveDown().text(`Total: ₹${Math.round(order.total * 83.5)}`);
    doc.end();

    doc.on('end', () => resolve(filePath));
  });
};

// Place Order
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order({ ...req.body, status: 'Pending', paymentStatus: 'Pending' });
    await order.save();

    const invoicePath = path.join(invoiceDir, `${order._id}.pdf`);
    await generateInvoice(order, invoicePath);

    await axios.post('https://api.brevo.com/v3/smtp/email',
      {
        to: [{ email: order.email, name: order.name }],
        sender: { name: 'StyleAura', email: process.env.SMTP_USER },
        subject: 'Order Confirmation - StyleAura',
        htmlContent: `
          <h3>Hi ${order.name},</h3>
          <p>Thanks for your order. Here's your invoice:</p>
          <ul>
            ${order.items.map(item => {
              const unit = Math.round(item.price * 83.5);
              return `<li>${item.name} × ${item.quantity} - ₹${unit * item.quantity}</li>`;
            }).join('')}
          </ul>
          <p><strong>Total:</strong> ₹${Math.round(order.total * 83.5)}</p>
        `,
        attachment: [{
          name: 'invoice.pdf',
          content: fs.readFileSync(invoicePath).toString('base64'),
        }],
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      });

    res.status(201).json({ success: true, orderId: order._id });
  } catch (err) {
    console.error('❌ Order error:', err);
    res.status(500).json({ success: false, message: 'Order failed.' });
  }
});

// Get all orders (Admin only)
app.get('/api/orders', requireAdmin, async (_, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Update order status (Admin only)
app.put('/api/orders/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status, paymentStatus });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Failed to update order' });
  }
});

// Analytics (Admin only)
app.get('/api/admin/analytics', requireAdmin, async (_, res) => {
  try {
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const statusCount = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});
    const productMap = {};
    orders.forEach(o =>
      o.items.forEach(item => {
        if (!productMap[item.name]) productMap[item.name] = { name: item.name, quantity: 0 };
        productMap[item.name].quantity += item.quantity;
      })
    );
    const topProducts = Object.values(productMap).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
    res.json({ totalOrders, totalSales, statusCount, topProducts });
  } catch (err) {
    console.error('❌ Analytics error:', err);
    res.status(500).json({ message: 'Analytics failed' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

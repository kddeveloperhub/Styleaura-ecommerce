const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  items: Array,
  total: Number,
  status: { type: String, default: 'Pending' }, // shipping status
  paymentStatus: { type: String, default: 'Pending' }, // ✅ New field
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

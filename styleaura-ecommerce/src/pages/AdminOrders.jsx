// src/pages/AdminOrders.jsx

import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'https://styleaura-ecommerce.onrender.com';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const navigate = useNavigate();

  // ✅ Verify Admin Session and Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // ✅ Check if admin is logged in
        const res = await fetch(`${API_BASE}/api/admin/check`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();

        if (!data.isAdmin) {
          toast.warning('Please login as admin');
          return navigate('/admin/login');
        }

        // ✅ Fetch orders
        const ordersRes = await fetch(`${API_BASE}/api/orders`, {
          credentials: 'include',
        });

        const orderData = await ordersRes.json();
        setOrders(orderData);
        setFiltered(orderData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        toast.error('Could not fetch orders');
      }
    };

    fetchOrders();
  }, [navigate]);

  // ✅ Filter logic
  useEffect(() => {
    let filteredOrders = [...orders];
    if (statusFilter !== 'All') filteredOrders = filteredOrders.filter(o => o.status === statusFilter);
    if (paymentFilter !== 'All') filteredOrders = filteredOrders.filter(o => o.paymentStatus === paymentFilter);
    if (fromDate) filteredOrders = filteredOrders.filter(o => new Date(o.createdAt) >= new Date(fromDate));
    if (toDate) filteredOrders = filteredOrders.filter(o => new Date(o.createdAt) <= new Date(toDate));
    setFiltered(filteredOrders);
  }, [statusFilter, paymentFilter, fromDate, toDate, orders]);

  const updateOrderField = async (orderId, field, value) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (res.ok) {
        toast.success(`${field} updated`);
        setOrders(prev =>
          prev.map(o => (o._id === orderId ? { ...o, [field]: value } : o))
        );
      } else {
        const errData = await res.json();
        toast.error(errData.message || `Failed to update ${field}`);
      }
    } catch (err) {
      toast.error(`Error updating ${field}`);
      console.error(err);
    }
  };

  const generateInvoice = (order) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18).text('Invoice', 14, 22);
      doc.setFontSize(12);

      doc.text(`Order ID: ${order._id}`, 14, 32);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 38);
      doc.text(`Customer: ${order.name}`, 14, 44);
      doc.text(`Email: ${order.email}`, 14, 50);
      doc.text(`Phone: ${order.phone}`, 14, 56);
      doc.text(`Address: ${order.address}, ${order.city}, ${order.state}, ${order.zip}`, 14, 62);

      const rows = (order.items || []).map(i => [
        i.name,
        i.quantity,
        `₹${(i.price * 83.5).toFixed(0)}`,
        `₹${(i.price * 83.5 * i.quantity).toFixed(0)}`,
      ]);

      doc.autoTable({
        startY: 70,
        head: [['Item', 'Qty', 'Unit ₹', 'Subtotal ₹']],
        body: rows,
      });

      doc.setFontSize(14).text(`Total: ₹${(order.total * 83.5).toFixed(0)}`, 14, doc.lastAutoTable.finalY + 10);
      doc.save(`invoice_${order._id}.pdf`);
    } catch (err) {
      toast.error('Failed to generate invoice');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center mb-6 text-pink-600">Admin Orders</h2>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border px-3 py-2 rounded">
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>

        <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="border px-3 py-2 rounded">
          <option value="All">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border px-3 py-2 rounded" />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border px-3 py-2 rounded" />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-600">No orders to display.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order._id} className="border-t">
                  <td className="px-4 py-2">{order.name}</td>
                  <td className="px-4 py-2">{order.email}</td>
                  <td className="px-4 py-2">
                    <ul className="list-disc ml-4">
                      {order.items.map((i, idx) => (
                        <li key={idx}>{i.name} × {i.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2">₹{Math.round(order.total * 83.5)}</td>
                  <td className="px-4 py-2">
                    <select
                      value={order.status}
                      onChange={e => updateOrderField(order._id, 'status', e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    {order.paymentStatus === 'Paid' ? (
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">Paid</span>
                    ) : (
                      <button
                        onClick={() => updateOrderField(order._id, 'paymentStatus', 'Paid')}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => generateInvoice(order)}
                      className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Download
                    </button>
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

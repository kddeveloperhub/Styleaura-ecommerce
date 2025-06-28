import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// ✅ Safer and production-compatible API URL
const API_BASE = process.env.REACT_APP_API_URL || 'https://styleaura-ecommerce.onrender.com';


const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAndFetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/check`, {
          credentials: 'include',
        });
        const data = await res.json();

        if (!data.isAdmin) {
          console.log('Not an admin. Redirecting to login...');
          navigate('/admin/login');
          return;
        }

        const ordersRes = await fetch(`${API_BASE}/api/orders`, {
          credentials: 'include',
        });

        if (ordersRes.status === 401) {
          console.log('Unauthorized. Redirecting...');
          navigate('/admin/login');
          throw new Error('Unauthorized');
        }

        const ordersData = await ordersRes.json();
        setOrders(ordersData);
        setFiltered(ordersData);
      } catch (err) {
        console.error('Error during admin check or fetching orders:', err);
        toast.error('Failed to fetch orders. Check server or login status.');
      }
    };

    verifyAndFetchOrders();
  }, [navigate]);

  useEffect(() => {
    let filteredOrders = [...orders];

    if (statusFilter !== 'All') {
      filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }

    if (paymentFilter !== 'All') {
      filteredOrders = filteredOrders.filter(order => order.paymentStatus === paymentFilter);
    }

    if (fromDate) {
      filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) >= new Date(fromDate));
    }

    if (toDate) {
      filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) <= new Date(toDate));
    }

    setFiltered(filteredOrders);
  }, [statusFilter, paymentFilter, fromDate, toDate, orders]);

  const updateOrderField = async (orderId, field, value) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ [field]: value }),
      });

      if (res.ok) {
        toast.success(`${field} updated`);
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, [field]: value } : order
          )
        );
      } else {
        const errData = await res.json();
        toast.error(`Failed to update ${field}: ${errData.message || res.status}`);
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
      doc.text(`Email: ${order.email}`, 14, 51);
      doc.text(`Phone: ${order.phone}`, 14, 58);
      doc.text(`Address: ${order.address}, ${order.city}, ${order.state} - ${order.zip}`, 14, 65);

      const itemRows = (order.items || []).map((item) => [
        item.name,
        item.quantity,
        `₹${item.price.toFixed(2)}`,
        `₹${(item.quantity * item.price).toFixed(2)}`
      ]);

      doc.autoTable({
        startY: 75,
        head: [['Item', 'Qty', 'Price', 'Subtotal']],
        body: itemRows,
        styles: { fontSize: 11 },
      });

      doc.setFontSize(13);
      doc.text(`Total: ₹${order.total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
      doc.save(`invoice_${order._id}.pdf`);
      toast.success('Invoice downloaded');
    } catch (err) {
      toast.error('Failed to generate invoice');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-white">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-center text-pink-600">📋 Admin - Orders</h2>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border px-3 py-2 rounded">
          <option value="All">All Order Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>

        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="border px-3 py-2 rounded">
          <option value="All">All Payment Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border px-3 py-2 rounded" />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border px-3 py-2 rounded" />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Order Status</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{order.name}</td>
                  <td className="px-4 py-2">{order.email}</td>
                  <td className="px-4 py-2">
                    <ul className="list-disc ml-5">
                      {(order.items || []).map((item, idx) => (
                        <li key={idx}>{item.name} × {item.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2">₹{order.total.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderField(order._id, 'status', e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option>Pending</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.paymentStatus || 'Pending'}
                      </span>
                      {order.paymentStatus !== 'Paid' && (
                        <button
                          onClick={() => updateOrderField(order._id, 'paymentStatus', 'Paid')}
                          className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => generateInvoice(order)}
                      className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-3 py-1 rounded"
                    >
                      Invoice
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

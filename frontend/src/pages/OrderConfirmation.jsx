import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

const OrderConfirmation = () => {
  const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));

  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const generateInvoice = () => {
    if (!lastOrder) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('StyleAura Invoice', 20, 20);

    doc.setFontSize(12);
    doc.text(`Customer: ${lastOrder.name}`, 20, 40);
    doc.text(`Email: ${lastOrder.email}`, 20, 50);
    doc.text(`Phone: ${lastOrder.phone}`, 20, 60);

    doc.text(
      `Address: ${lastOrder.address}, ${lastOrder.city}, ${lastOrder.state} - ${lastOrder.zip}`,
      20,
      70
    );

    doc.text('----------------------------------------', 20, 85);

    let y = 95;
    lastOrder.items.forEach((item, i) => {
      const price = Math.round(item.price * 83.5);
      doc.text(
        `${i + 1}. ${item.name} (${item.quantity}) - ₹${price * item.quantity}`,
        20,
        y
      );
      y += 10;
    });

    doc.text('----------------------------------------', 20, y + 5);

    const total = Math.round(lastOrder.totalINR || lastOrder.total * 83.5);

    doc.setFontSize(14);
    doc.text(`Total: ₹${total}`, 20, y + 20);

    doc.save(`StyleAura_Invoice.pdf`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🔥 FALLBACK
  if (!lastOrder) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center">
        <h2 className="text-2xl font-bold mb-4">No Order Found</h2>
        <Link to="/" className="bg-pink-500 text-white px-6 py-2 rounded">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16 text-center">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">

        {/* SUCCESS */}
        <h1 className="text-4xl font-bold text-pink-600 mb-4">
          🎉 Order Confirmed!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order is being processed.
        </p>

        {/* ORDER DETAILS */}
        <div className="text-left bg-gray-50 p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">Order Details</h3>

          <p><strong>Name:</strong> {lastOrder.name}</p>
          <p><strong>Email:</strong> {lastOrder.email}</p>
          <p><strong>Phone:</strong> {lastOrder.phone}</p>
          <p><strong>City:</strong> {lastOrder.city}</p>
        </div>

        {/* ITEMS */}
        <div className="text-left mb-6">
          <h3 className="font-semibold mb-3">Items</h3>

          <div className="space-y-2">
            {lastOrder.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between border-b pb-2"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="text-pink-600">
                  {formatINR(item.price * 83.5 * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TOTAL */}
        <div className="text-xl font-bold text-pink-600 mb-6">
          Total: {formatINR(lastOrder.totalINR || lastOrder.total * 83.5)}
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg"
          >
            Continue Shopping
          </Link>

          <button
            onClick={generateInvoice}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
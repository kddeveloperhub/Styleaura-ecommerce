// src/pages/OrderConfirmation.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

const OrderConfirmation = () => {
  const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));

  const generateInvoice = () => {
    if (!lastOrder) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('StyleAura - Order Invoice', 20, 20);
    doc.setFontSize(12);

    doc.text(`Name: ${lastOrder.name}`, 20, 40);
    doc.text(`Email: ${lastOrder.email}`, 20, 50);
    doc.text(`Phone: ${lastOrder.phone}`, 20, 60);
    doc.text(`Address: ${lastOrder.address}, ${lastOrder.city}, ${lastOrder.state} - ${lastOrder.zip}`, 20, 70);

    doc.text('Items:', 20, 90);
    let startY = 100;
    lastOrder.items.forEach((item, index) => {
      const itemInr = Math.round(item.price * 83.5);
      doc.text(`${index + 1}. ${item.name} × ${item.quantity} = ₹${itemInr * item.quantity}`, 25, startY + index * 10);
    });

    const totalInr = Math.round(lastOrder.total * 83.5);
    doc.text(`Total: ₹${totalInr}`, 20, startY + lastOrder.items.length * 10 + 10);
    doc.save(`invoice_${lastOrder.name.replace(/\s/g, '_')}.pdf`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white px-4 py-20 text-center">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-600 mb-6">🎉 Order Confirmed!</h1>
        <p className="text-gray-700 mb-4">
          Thank you for your purchase! Your order has been placed successfully and is now being processed.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Link
            to="/"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Continue Shopping
          </Link>
          {lastOrder && (
            <button
              onClick={generateInvoice}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Download Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

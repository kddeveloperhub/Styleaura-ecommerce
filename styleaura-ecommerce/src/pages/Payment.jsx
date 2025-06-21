import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Payment = () => {
  const { amount } = useParams(); // gets INR amount from URL
  const navigate = useNavigate();

  const upiId = 'tushardhawan1607@oksbi';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=${upiId}&pn=StyleAura&am=${amount}&cu=INR`;

  const handlePaid = () => {
    alert('✅ Thank you! Payment confirmed.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>

      <img src={qrUrl} alt="UPI QR" className="mb-4 border p-2 rounded" />
      
      <p className="text-gray-700 mb-2">
        Scan to pay ₹<strong>{amount}</strong> using Google Pay / PhonePe / UPI
      </p>
      
      <p className="text-sm text-gray-500 mb-1">
        UPI ID: <strong>{upiId}</strong>
      </p>
      
      <button
        onClick={() => navigator.clipboard.writeText(upiId)}
        className="text-pink-500 underline text-sm mb-4"
      >
        Copy UPI ID
      </button>

      <button
        onClick={handlePaid}
        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded text-lg mt-4"
      >
        I have paid ₹{amount}
      </button>
    </div>
  );
};

export default Payment;

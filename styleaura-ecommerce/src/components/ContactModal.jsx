import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

const ContactModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = form;
    if (!name || !email || !message) {
      alert('Please fill out all fields');
      return;
    }

    // Use EmailJS to send the email
    emailjs.send(
      'service_vlt7q0k',     // ✅ Your Service ID
      'template_a964gra',    // ✅ Your Template ID
      form,                  // ✅ The form values
      'oaz8aFxWPhXZl4mTm'      // ❗ Replace with your EmailJS *public key*
    )
    .then(() => {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', email: '', message: '' });
        onClose();
      }, 2000);
    })
    .catch((error) => {
      console.error('EmailJS error:', error);
      alert('Something went wrong. Please try again.');
    });
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target.id === 'modal-backdrop') onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4"
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-green-600 mb-2">✅ Message Sent!</h2>
            <p className="text-gray-600 text-sm">We’ll get back to you shortly.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-pink-500 mb-4 text-center">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded font-semibold transition"
              >
                Send Message
              </button>
            </form>
          </>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default ContactModal;

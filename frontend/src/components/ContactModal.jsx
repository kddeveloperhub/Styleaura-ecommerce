import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";

const ContactModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 🔄 Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Validation
  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.includes("@")) return "Valid email required";
    if (!form.message.trim()) return "Message is required";
    return null;
  };

  // 📩 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      setLoading(true);

      await emailjs.send(
        process.env.REACT_APP_EMAIL_SERVICE,
        process.env.REACT_APP_EMAIL_TEMPLATE,
        form,
        process.env.REACT_APP_EMAIL_PUBLIC_KEY
      );

      setSubmitted(true);
      toast.success("Message sent successfully!");

      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: "", email: "", message: "" });
        onClose();
      }, 2000);
    } catch (err) {
      console.error("EmailJS error:", err);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  // ❌ ESC close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ❌ Backdrop click
  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4"
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-xl animate-fade-in">

        {/* ❌ Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-green-600 mb-2">
              ✅ Message Sent!
            </h2>
            <p className="text-gray-600 text-sm">
              We’ll get back to you shortly.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-pink-500 mb-4 text-center">
              Contact Us
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-pink-500"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-pink-500"
              />

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-2 border rounded resize-none focus:ring-2 focus:ring-pink-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded font-semibold transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
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
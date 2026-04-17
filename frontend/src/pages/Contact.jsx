// src/pages/Contact.jsx
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import emailjs from 'emailjs-com';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  const showToast = (msg, type = 'error') => {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
    };

    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    toast.textContent = msg;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name || !form.email || !form.message) {
      showToast('Please fill all fields');
      return false;
    }

    if (!form.email.includes('@')) {
      showToast('Invalid email');
      return false;
    }

    if (form.message.length < 10) {
      showToast('Message too short');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE,
        process.env.REACT_APP_EMAILJS_TEMPLATE,
        form,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      showToast('Message sent successfully!', 'success');

      setForm({
        name: '',
        email: '',
        message: '',
      });

    } catch (err) {
      console.error(err);
      showToast('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto py-16 px-4">

        {/* 🔥 TITLE */}
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2" data-aos="fade-up">
          Get In Touch With Us
        </h1>

        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8" />

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Have questions? We’d love to hear from you.
        </p>

        {/* 🔥 GRID */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* INFO */}
          <div className="space-y-6" data-aos="fade-right">
            {[
              {
                icon: '📍',
                title: 'Our Address',
                detail: 'Royal Estate Bhawanigarh, Punjab',
              },
              {
                icon: '📧',
                title: 'Email',
                detail: 'styleaura00@gmail.com',
              },
              {
                icon: '📞',
                title: 'Phone',
                detail: '+91 9988140768',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg p-8 space-y-6 border"
            data-aos="fade-left"
          >

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-pink-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-pink-500"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded h-32 focus:ring-2 focus:ring-pink-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded font-semibold transition disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* 🔥 MAP */}
        <div className="mt-20" data-aos="zoom-in">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=Bhawanigarh,Punjab&output=embed"
            width="100%"
            height="400"
            className="rounded-lg shadow-lg border-0"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
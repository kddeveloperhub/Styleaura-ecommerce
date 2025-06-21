// src/pages/Contact.jsx
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import emailjs from 'emailjs-com';


const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    AOS.init({ once: true });
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-20px); }
        10% { opacity: 1; transform: translateY(0); }
        90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
      }
      .animate-fade-in-out {
        animation: fadeInOut 3s ease-in-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const showToast = (msg, color = 'red') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 bg-${color}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  const { name, email, message } = form;

  if (!name || !email || !message) {
    return showToast('Please fill out all fields');
  }

  emailjs.send(
    'service_vlt7q0k',       // e.g., 'service_xxxxxx'
    'template_a964gra',      // e.g., 'template_yyyyyy'
    { name, email, message }, // these must match your template variables
    'oaz8aFxWPhXZl4mTm'        // e.g., 'cWxh6ZC9ZT...'
  )
    .then(() => {
      showToast('Your message has been sent!', 'green');
      setForm({ name: '', email: '', message: '' });
    })
    .catch((err) => {
      console.error('EmailJS Error:', err);
      showToast('Failed to send message. Try again.');
    });
};


  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2" data-aos="fade-up">
          Get In Touch With Us
        </h1>
        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8" data-aos="fade-up" data-aos-delay="100"></div>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12" data-aos="fade-up" data-aos-delay="150">
          Whether you have a question about features, shipping, returns, or anything else—our team is ready to answer all your questions.
        </p>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6 text-gray-700" data-aos="fade-right">
            {[
              {
                icon: 'fas fa-map-marker-alt',
                title: 'Our Address',
                detail: 'Royal Estate Bhawanigarh Punjab, India',
              },
              {
                icon: 'fas fa-envelope',
                title: 'Email Us',
                detail: 'styleaura00@gmail.com',
              },
              {
                icon: 'fas fa-phone-alt',
                title: 'Call Us',
                detail: '9988140768',
              },
            ].map(({ icon, title, detail }, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="text-pink-500 text-xl"><i className={icon}></i></div>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-gray-500">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6 border" data-aos="fade-left">
            {['name', 'email'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-gray-700 font-semibold mb-2 capitalize">{field}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder={field === 'name' ? 'Your name' : 'you@example.com'}
                />
              </div>
            ))}
            <div>
              <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Map Embed */}
      <div className="mt-20" data-aos="zoom-in">
  <iframe
    title="Google Map"
    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3446.098224933423!2d76.02845287546644!3d30.262782408193058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzDCsDE1JzQ2LjAiTiA3NsKwMDEnNTEuNyJF!5e0!3m2!1sen!2sin!4v1750227486047!5m2!1sen!2sin"
    width="100%"
    height="400"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="rounded-lg shadow-lg"
  ></iframe>
</div>

      </div>
    </div>
  );
};

export default Contact;

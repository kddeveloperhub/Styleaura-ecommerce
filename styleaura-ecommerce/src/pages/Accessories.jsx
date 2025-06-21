// src/pages/Accessories.jsx
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useCart } from '../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Images
import heroImage from '../assets/accessories-hero.png';
import handbagImg from '../assets/handbag.jpg';
import watchsImg from '../assets/watchs.jpg';
import beltImg from '../assets/belt.jpg';
import scarfImg from '../assets/scarf.jpg';

const Accessories = () => {
  const [email, setEmail] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  const handleSubscribe = async () => {
    if (!email) return toast.warn('Please enter your email');
    try {
      const res = await fetch('http://192.168.43.139:5000/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setEmail('');
        toast.success('Thanks for subscribing!');
      } else {
        toast.error(data.message || 'Failed to subscribe.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error. Try again.');
    }
  };

  const products = [
    { id: 1, image: handbagImg, title: 'Designer Handbag', price: 59.99 },
    { id: 2, image: watchsImg, title: 'Statement Luxury Watch', price: 69.99 },
    { id: 3, image: beltImg, title: 'Premium Leather Belt', price: 79.99 },
    { id: 4, image: scarfImg, title: 'Silk Scarf', price: 89.99 },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
      {/* Hero Section */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl relative z-10">
            <h1 className="text-5xl font-bold text-gray-900 mb-4" data-aos="fade-up">
              Elevate Your Style With Premium Accessories
            </h1>
            <p
              className="text-lg text-gray-700 mb-8"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              Discover our curated collection of luxury accessories that add the perfect finishing touch to any outfit. From statement pieces to timeless classics.
            </p>

            <button
              className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-8 rounded-lg font-medium transition duration-300 mb-4"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              Explore More
            </button>

            <div
              className="text-lg md:text-xl font-semibold text-pink-600"
              data-aos="fade-in"
              data-aos-delay="400"
            >
              <nav aria-label="breadcrumb">
                <ol className="inline-flex items-center space-x-2">
                  <li>
                    <a href="/" className="hover:underline hover:text-pink-700">
                      Home
                    </a>
                  </li>
                  <li>/</li>
                  <li className="text-gray-800">Accessories</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Accessories Collection */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-2" data-aos="fade-up">Accessories Collection</h2>
        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8"></div>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12" data-aos="fade-up" data-aos-delay="100">
          Complete your look with our premium accessories. From elegant jewelry to practical essentials, our accessories are designed to complement your personal style and make a lasting impression.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item, idx) => {
            const inrPrice = (item.price * 83.5).toFixed(0);
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden group" data-aos="fade-up" data-aos-delay={idx * 100}>
                <div className="h-80 overflow-hidden bg-gray-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-500 font-bold">₹{inrPrice}</span>
                    <button
                      onClick={() => addToCart({ id: item.id, name: item.title, image: item.image, price: item.price, quantity: 1 })}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg transition duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <button className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-8 rounded-lg font-medium transition duration-300">
            View All Accessories
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2" data-aos="fade-up">Our Accessories Promise</h2>
          <div className="w-24 h-1 bg-pink-500 mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'fas fa-gem', title: 'Premium Materials', desc: 'We source only the highest quality materials for accessories that look and feel luxurious.' },
              { icon: 'fas fa-certificate', title: 'Authentic Design', desc: 'Each accessory is thoughtfully designed to be both fashionable and functional.' },
              { icon: 'fas fa-hands', title: 'Quality Craftsmanship', desc: 'Meticulous attention to detail ensures our accessories stand the test of time.' },
              { icon: 'fas fa-shield-alt', title: 'Lifetime Warranty', desc: 'We stand behind our accessories with a comprehensive lifetime warranty.' },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center" data-aos="zoom-in" data-aos-delay={index * 100}>
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${feature.icon} text-2xl text-pink-500`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg shadow-lg p-8 text-center text-white" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6">Stay updated with our latest collections, exclusive offers, and fashion tips.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative">
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email address"
              className="flex-grow py-3 px-4 rounded-lg border-none focus:ring-2 focus:ring-white text-gray-800 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              id="newsletter-submit"
              onClick={handleSubscribe}
              className="bg-white text-pink-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 whitespace-nowrap cursor-pointer"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accessories;

import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import heroImage from '../assets/hero.jpg';
import testimonial1 from '../assets/testimonial1.jpg';
import testimonial2 from '../assets/testimonial2.jpg';
import testimonial3 from '../assets/testimonial3.jpg';
import ProductCard from '../components/ProductCard';
import { menProducts, womenProducts } from '../data/products';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  const API = process.env.REACT_APP_API_URL || 'https://styleaura-ecommerce.onrender.com';

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      return toast.warn('Please enter a valid email address');
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setEmail('');
        toast.success('Thanks for subscribing!');
      } else {
        toast.error(data.message || 'Subscription failed');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error('Server error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />

      {/* Hero Section */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-transparent" />
        </div>
        <div className="container mx-auto px-4 h-full flex items-center justify-start">
          <div className="max-w-xl relative z-10" data-aos="fade-up">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Elevate Your Style With Premium Fashion
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Discover the latest trends and timeless classics that define modern elegance. Quality craftsmanship meets contemporary design.
            </p>
            <div className="flex gap-4">
              <button onClick={() => navigate('/women')} className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg font-medium transition">
                Shop Women
              </button>
              <button onClick={() => navigate('/men')} className="bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-6 rounded-lg font-medium transition">
                Shop Men
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Men's Wear */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-2" data-aos="fade-up">Men's Wear</h2>
        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8" data-aos="fade-up" />
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12" data-aos="fade-up" data-aos-delay="100">
          Modern tailoring, timeless comfort. Explore the finest in men's fashion.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {menProducts.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
        <div className="text-center mt-12">
          <button onClick={() => navigate('/men')} className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-8 rounded-lg font-medium transition">
            View All Men's Collection
          </button>
        </div>
      </section>

      {/* Women's Wear */}
      <section className="container mx-auto py-16 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-2" data-aos="fade-up">Women's Wear</h2>
        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8" data-aos="fade-up" />
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12" data-aos="fade-up" data-aos-delay="100">
          Elegant, empowering, and trend-forward. Discover our curated collection for women.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {womenProducts.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
        <div className="text-center mt-12">
          <button onClick={() => navigate('/women')} className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-8 rounded-lg font-medium transition">
            View All Women's Collection
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-4" data-aos="fade-up">What Our Customers Say</h2>
        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8" data-aos="fade-up" />
        <div className="grid md:grid-cols-3 gap-8 container mx-auto">
          {[testimonial1, testimonial2, testimonial3].map((img, index) => {
            const quotes = [
              "The quality of StyleAura's clothing is exceptional. I've never felt more confident.",
              "I'm impressed with the attention to detail and the fit. Will shop again!",
              "The customer service is outstanding! I found exactly what I needed."
            ];
            const names = ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez'];
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition" data-aos="zoom-in" data-aos-delay={index * 150}>
                <img src={img} alt={names[index]} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
                <p className="text-gray-700 italic mb-2">“{quotes[index]}”</p>
                <p className="text-sm text-gray-600">{names[index]}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-2" data-aos="fade-up">Why Choose Us</h2>
        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8" data-aos="fade-up" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { icon: 'fas fa-tshirt', title: 'Premium Fabrics', desc: 'We use only the best materials for durability and comfort.' },
            { icon: 'fas fa-cut', title: 'Modern Tailoring', desc: 'Crafted for perfect fits and timeless appeal.' },
            { icon: 'fas fa-undo', title: 'Easy Returns', desc: 'Hassle-free 30-day return policy.' },
            { icon: 'fas fa-star', title: 'Style Aura', desc: 'Bold fashion that reflects your individuality.' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition" data-aos="fade-up" data-aos-delay={idx * 100}>
              <div className="text-pink-500 text-3xl mb-4"><i className={feature.icon}></i></div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg shadow-lg p-8 text-center text-white" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6">Get updates on new arrivals, exclusive offers & fashion tips.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow py-3 px-4 rounded-lg text-gray-800 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className={`bg-white text-pink-600 hover:bg-gray-100 py-3 px-6 rounded-lg font-medium transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Sending...' : 'Sign Up'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

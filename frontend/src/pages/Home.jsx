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

// 🔥 FIREBASE
import { db } from '../firebase/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const Home = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ once: true, duration: 800, easing: 'ease-in-out' });
  }, []);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      return toast.warn('Please enter a valid email address');
    }

    try {
      setLoading(true);

      await addDoc(collection(db, 'newsletter'), {
        email,
        createdAt: Timestamp.now(),
      });

      setEmail('');
      toast.success('🎉 Subscribed successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />

      {/* 🔥 HERO */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-transparent" />
        </div>

        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl z-10" data-aos="fade-right">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Elevate Your Style With Premium Fashion
            </h1>

            <p className="text-lg text-gray-700 mb-8">
              Discover modern fashion that blends comfort, quality, and elegance.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/women')}
                className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg hover:scale-105 transition"
              >
                Shop Women
              </button>

              <button
                onClick={() => navigate('/men')}
                className="bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-6 rounded-lg hover:scale-105 transition"
              >
                Shop Men
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 MEN */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-2" data-aos="fade-up">Men's Wear</h2>
        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {menProducts.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      {/* 🔥 WOMEN */}
      <section className="container mx-auto py-16 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-2" data-aos="fade-up">Women's Wear</h2>
        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {womenProducts.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      {/* 🔥 TESTIMONIALS */}
      <section className="bg-gray-100 py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-4" data-aos="fade-up">
          What Our Customers Say
        </h2>

        <div className="w-24 h-1 bg-pink-500 mx-auto mb-10" />

        <div className="grid md:grid-cols-3 gap-8 container mx-auto">
          {[
            {
              img: testimonial1,
              name: "Sarah Johnson",
              text: "Amazing quality and perfect fitting. I absolutely love StyleAura!",
            },
            {
              img: testimonial2,
              name: "Michael Chen",
              text: "Super fast delivery and stylish designs. Highly recommended!",
            },
            {
              img: testimonial3,
              name: "Emily Rodriguez",
              text: "Best shopping experience ever. Great support and premium feel.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl hover:-translate-y-2 transition"
              data-aos="zoom-in"
              data-aos-delay={index * 150}
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-pink-500"
              />
              <p className="text-gray-700 italic mb-3">“{item.text}”</p>
              <h4 className="text-pink-600 font-semibold">{item.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 WHY */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-4" data-aos="fade-up">
          Why Choose StyleAura
        </h2>

        <div className="w-24 h-1 bg-pink-500 mx-auto mb-10" />

        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[
            { title: 'Premium Fabrics', desc: 'Soft, durable and luxury feel materials.' },
            { title: 'Perfect Fit', desc: 'Tailored designs for modern body fits.' },
            { title: 'Easy Returns', desc: '30-day hassle-free returns policy.' },
            { title: 'Fast Delivery', desc: 'Quick shipping across India.' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded shadow hover:shadow-xl hover:-translate-y-2 transition"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 NEWSLETTER */}
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-pink-500 to-cyan-500 p-8 text-center text-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Subscribe</h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="bg-white text-pink-600 px-6 py-3 rounded font-semibold"
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
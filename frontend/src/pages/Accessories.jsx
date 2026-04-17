import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useCart } from '../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaGem, FaCertificate, FaHandsHelping, FaShieldAlt } from 'react-icons/fa';
import { db } from '../firebase/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

// Images
import heroImage from '../assets/accessories-hero.png';
import handbagImg from '../assets/handbag.jpg';
import watchsImg from '../assets/watchs.jpg';
import beltImg from '../assets/belt.jpg';
import scarfImg from '../assets/scarf.jpg';

const Accessories = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  // 🔥 FIREBASE NEWSLETTER
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

  const products = [
    { id: 1, image: handbagImg, title: 'Designer Handbag', price: 59.99 },
    { id: 2, image: watchsImg, title: 'Statement Luxury Watch', price: 69.99 },
    { id: 3, image: beltImg, title: 'Premium Leather Belt', price: 79.99 },
    { id: 4, image: scarfImg, title: 'Silk Scarf', price: 89.99 },
  ];

  const icons = [FaGem, FaCertificate, FaHandsHelping, FaShieldAlt];

  const features = [
    { title: 'Premium Materials', desc: 'Only the highest quality materials for a luxurious finish.' },
    { title: 'Authentic Design', desc: 'Elegant, timeless designs that express your personality.' },
    { title: 'Quality Craftsmanship', desc: 'Made to last with careful attention to every stitch.' },
    { title: 'Lifetime Warranty', desc: 'We guarantee our accessories with full support.' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />

      {/* HERO */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="max-w-xl relative z-10 px-4 sm:px-0">
            <h1 className="text-5xl font-bold text-gray-900 mb-4" data-aos="fade-up">
              Elevate Your Style With Premium Accessories
            </h1>

            <p className="text-lg text-gray-700 mb-8" data-aos="fade-up" data-aos-delay="150">
              Discover a curated collection of elegant accessories — designed to enhance every outfit.
            </p>

            <button
              className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-8 rounded-lg font-medium transition"
              data-aos="zoom-in"
            >
              Explore More
            </button>

            {/* Breadcrumb */}
            <div className="text-lg font-semibold text-pink-600 mt-4">
              <a href="/" className="hover:underline">Home</a> / Accessories
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="container mx-auto py-16 px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-center mb-2" data-aos="fade-up">
          Accessories Collection
        </h2>

        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8"></div>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Hand-picked designs to enhance every look.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item, idx) => {
            const inrPrice = new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
            }).format(item.price * 83.5);

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="h-80 bg-gray-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>

                  <div className="flex justify-between items-center">
                    <span className="text-pink-500 font-bold">{inrPrice}</span>

                    <button
                      onClick={() => {
                        addToCart({
                          id: item.id,
                          name: item.title,
                          image: item.image,
                          price: item.price,
                          quantity: 1,
                        });
                        toast.success('Added to cart');
                      }}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Our Promise</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {icons.map((Icon, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow text-center">
                <Icon className="text-3xl text-pink-500 mx-auto mb-4" />
                <h3 className="font-semibold">{features[index].title}</h3>
                <p className="text-gray-600 text-sm mt-2">{features[index].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container mx-auto py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-pink-500 to-cyan-500 p-8 text-center text-white rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Subscribe</h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter email"
              className="flex-1 px-4 py-3 rounded text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="bg-white text-pink-600 px-6 py-3 rounded font-semibold"
            >
              {loading ? 'Sending...' : 'Subscribe'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accessories;
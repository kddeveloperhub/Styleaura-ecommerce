// src/components/Footer.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gray-900 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-3">StyleAura</h3>
          <p className="text-sm text-gray-400">
            Elevating fashion with premium quality and modern designs since 2018.
          </p>
          <div className="flex space-x-3 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-500 hover:bg-pink-600 w-9 h-9 flex items-center justify-center rounded-full"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f text-white text-sm" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-500 hover:bg-pink-600 w-9 h-9 flex items-center justify-center rounded-full"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-white text-sm" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-500 hover:bg-pink-600 w-9 h-9 flex items-center justify-center rounded-full"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter text-white text-sm" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/men" className="hover:text-white">Men's Collection</Link></li>
            <li><Link to="/women" className="hover:text-white">Women's Collection</Link></li>
            <li><Link to="/accessories" className="hover:text-white">Accessories</Link></li>
             <li className='hover:text-white'> Careers</li>
          </ul>
        </div>

        <div>
          <h4 className="text-md font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className='hover:text-white'>FAQs</li>
            <li className='hover:text-white'>Shipping Policy</li>
             <li className='hover:text-white'>Returns & Exchanges</li>
              <li className='hover:text-white'>Size Guide</li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-md font-semibold mb-3">Contact Us</h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            Royal Estate, Bhawanigarh, Punjab<br />
            +91 9988140768<br />
            <a href="mailto:styleaura00@gmail.com" className="hover:text-white">styleaura00@gmail.com</a>
          </p>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-12 border-t border-gray-700 pt-6">
        © 2025 StyleAura. All rights reserved.
      </div>

      {/* Floating Buttons */}
      {showTopBtn && (
        <div className="fixed bottom-6 right-6 flex flex-col items-center space-y-3 z-50">
          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="bg-pink-500 hover:bg-pink-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition"
            aria-label="Back to Top"
          >
            <i className="fas fa-chevron-up" />
          </button>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/9988140768"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition"
            aria-label="Chat on WhatsApp"
          >
            <i className="fab fa-whatsapp text-xl" />
          </a>
        </div>
      )}
    </footer>
  );
};

export default Footer;

// src/components/Layout.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ContactModal from './ContactModal';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (location.pathname === '/contact') {
      setShowModal(false); // skip modal on contact page
    } else {
      setShowModal(true);  // show modal on all other pages initially
    }
  }, [location]);

  return (
    <>
      <Navbar />
      {showModal ? (
        <ContactModal isOpen={true} onClose={() => setShowModal(false)} />
      ) : (
        children
      )}
      <Footer />
    </>
  );
};

export default Layout;

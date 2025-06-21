// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Men from './pages/Men';
import Women from './pages/Women';
import Accessories from './pages/Accessories';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import SearchResults from './pages/SearchResults';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderConfirmation from './pages/OrderConfirmation';
import ProductDetails from './pages/ProductDetails';
import AdminOrders from './pages/AdminOrders';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard'; 


const App = () => {
  return (
    <Routes>
      {/* ✅ Admin Login Page - no layout */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ✅ Contact Page - custom layout with Navbar + Footer */}
      <Route
        path="/contact"
        element={
          <>
            <Navbar />
            <Contact />
            <Footer />
          </>
        }
      />

      {/* ✅ Everything else wrapped in shared Layout */}
      <Route
        path="*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/men" element={<Men />} />
              <Route path="/women" element={<Women />} />
              <Route path="/accessories" element={<Accessories />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment/:orderId" element={<Payment />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* ✅ Admin Protected Page */}
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
};

export default App;

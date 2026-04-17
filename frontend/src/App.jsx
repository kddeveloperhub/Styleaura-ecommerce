import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Accessories from "./pages/Accessories";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import SearchResults from "./pages/SearchResults";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderConfirmation from "./pages/OrderConfirmation";
import ProductDetails from "./pages/ProductDetails";
import MyOrders from "./pages/MyOrders";

// Auth
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Admin
import AdminDashboard from "./pages/AdminDashboard";


const App = () => {
  return (
    <Routes>

      {/* 🌐 PUBLIC + LAYOUT */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      <Route
        path="/about"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />

      <Route
        path="/men"
        element={
          <Layout>
            <Men />
          </Layout>
        }
      />

      <Route
        path="/women"
        element={
          <Layout>
            <Women />
          </Layout>
        }
      />

      <Route
        path="/accessories"
        element={
          <Layout>
            <Accessories />
          </Layout>
        }
      />

      <Route
        path="/cart"
        element={
          <Layout>
            <Cart />
          </Layout>
        }
      />

      <Route
        path="/wishlist"
        element={
          <Layout>
            <Wishlist />
          </Layout>
        }
      />

      <Route
        path="/search"
        element={
          <Layout>
            <SearchResults />
          </Layout>
        }
      />

      <Route
        path="/product/:id"
        element={
          <Layout>
            <ProductDetails />
          </Layout>
        }
      />

      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />

      {/* 🔐 AUTH */}
      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />

      <Route
        path="/signup"
        element={
          <Layout>
            <Signup />
          </Layout>
        }
      />

      {/* 🛒 USER PROTECTED */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Layout>
              <Checkout />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment/:orderId"
        element={
          <ProtectedRoute>
            <Layout>
              <Payment />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-confirmation"
        element={
          <ProtectedRoute>
            <Layout>
              <OrderConfirmation />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <Layout>
              <MyOrders />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 👑 ADMIN PROTECTED */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly={true}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      

      {/* ❌ FALLBACK */}
      <Route
        path="*"
        element={
          <Layout>
            <div className="min-h-screen flex items-center justify-center text-2xl">
              404 - Page Not Found
            </div>
          </Layout>
        }
      />
    </Routes>
  );
};

export default App;
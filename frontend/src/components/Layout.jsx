import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import ContactModal from "./ContactModal";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, role, loading } = useAuth(); // 🔥 ADD THIS

  const [showModal, setShowModal] = useState(false);

  // =========================
  // 🔥 ADMIN AUTO REDIRECT (MAIN FIX)
  // =========================
  useEffect(() => {
    if (!loading && user && role === "admin") {
      // ❗ already admin page pe ho to redirect mat karo
      if (!location.pathname.startsWith("/admin")) {
        console.log("🔥 Redirecting admin...");
        navigate("/admin/dashboard");
      }
    }
  }, [user, role, loading, location, navigate]);

  // =========================
  // 🔥 CONTACT MODAL LOGIC
  // =========================
  useEffect(() => {
    if (location.pathname === "/contact") {
      setShowModal(false);
      return;
    }

    const hasSeenModal = sessionStorage.getItem("contactModalShown");

    if (!hasSeenModal) {
      setTimeout(() => {
        setShowModal(true);
        sessionStorage.setItem("contactModalShown", "true");
      }, 1500);
    }
  }, [location]);

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Navbar />

      {/* 🔥 Modal */}
      {showModal && (
        <ContactModal isOpen={showModal} onClose={handleClose} />
      )}

      <main>{children}</main>

      <Footer />
    </>
  );
};

export default Layout;
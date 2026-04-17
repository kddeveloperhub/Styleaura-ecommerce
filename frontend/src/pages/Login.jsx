import React, { useState, useEffect } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🔥 FIX: role + loading bhi lo
  const { user, role, loading: authLoading } = useAuth();

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 LOGIN
  const handleLogin = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    return toast.warning("Please fill all fields");
  }

  try {
    setLoading(true);

    await login(form.email, form.password);

    toast.success("Login successful 🚀");

    // ❌ NO navigation here

  } catch (err) {
    toast.error(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
  // 🔥 MAIN FIX: wait for role properly
  useEffect(() => {
  if (!authLoading && user) {
    console.log("🔥 ROLE:", role);

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  }
}, [user, role, authLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-cyan-500 px-4">

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <form
        onSubmit={handleLogin}
        className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Welcome Back 👋
        </h2>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>

          <div className="relative mt-1">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              📧
            </span>
          </div>
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span> Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* FOOTER */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-pink-500 cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
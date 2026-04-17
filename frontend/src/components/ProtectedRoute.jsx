import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, role, loading } = useAuth();

  // 🔥 1. Wait for auth + role fetch
  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading...
      </div>
    );
  }

  // 🔥 2. Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 🔥 3. ADMIN CHECK (FIXED)
  if (adminOnly) {
    // ⏳ wait until role is resolved
    if (role === null) {
      return (
        <div className="text-center mt-20 text-gray-500">
          Checking access...
        </div>
      );
    }

    // ❌ not admin
    if (role !== "admin") {
      return <Navigate to="/" />;
    }
  }

  // ✅ allowed
  return children;
};

export default ProtectedRoute;
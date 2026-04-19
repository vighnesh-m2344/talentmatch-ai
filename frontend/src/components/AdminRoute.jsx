import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminRoute({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user || !token) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // role check
        if (user.role === "ADMIN") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        setIsAdmin(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // 🔄 LOADING STATE (prevents flicker / route jump)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking access...
      </div>
    );
  }

  // NOT ADMIN → redirect safely
  if (!isAdmin) {
    return (
      <Navigate
        to="/jobs"
        replace
        state={{ from: location }}
      />
    );
  }

  // ADMIN OK
  return children;
}
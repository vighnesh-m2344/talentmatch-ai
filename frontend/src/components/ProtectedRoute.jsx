import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userRaw = localStorage.getItem("user");

        if (!token || !userRaw) {
          setIsAllowed(false);
          setLoading(false);
          return;
        }

        const user = JSON.parse(userRaw);

        // basic role check
        if (adminOnly && user?.role !== "ADMIN") {
          setIsAllowed(false);
        } else {
          setIsAllowed(true);
        }

      } catch (err) {
        setIsAllowed(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, [adminOnly]);

  /* LOADING STATE */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking access...
      </div>
    );
  }

  /* NOT ALLOWED */
  if (!isAllowed) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  /* ALLOWED */
  return children;
}
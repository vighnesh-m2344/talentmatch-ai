import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

/* LAZY LOADING PAGES */
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Applications = lazy(() => import("./pages/Applications"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

/* PAGE ANIMATION */
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

/* LOADER */
function PageLoader() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
        Loading TalentMatch...
      </p>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  /* DARK MODE STATE */
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  /* APPLY THEME (SAFE + CLEAN) */
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 font-sans">

      <AnimatePresence mode="wait">

        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeOut" }}
        >

          <Suspense fallback={<PageLoader />}>

            <Routes location={location}>

              {/* ROOT REDIRECT */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* AUTH ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* USER ROUTES */}
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <Jobs darkMode={darkMode} setDarkMode={setDarkMode} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/applications"
                element={
                  <ProtectedRoute>
                    <Applications darkMode={darkMode} setDarkMode={setDarkMode} />
                  </ProtectedRoute>
                }
              />

              {/* ADMIN ROUTE */}
              <Route
                path="/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                    />
                  </AdminRoute>
                }
              />

              {/* 404 PAGE */}
              <Route
                path="*"
                element={
                  <div className="h-screen flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 px-4 text-center">
                    <h1 className="text-5xl font-bold mb-2">404</h1>
                    <p className="text-sm">Page not found</p>

                    <button
                      onClick={() => (window.location.href = "/jobs")}
                      className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition"
                    >
                      Go to Jobs
                    </button>
                  </div>
                }
              />

            </Routes>

          </Suspense>

        </motion.div>

      </AnimatePresence>

    </div>
  );
}
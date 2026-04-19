import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "./context/ThemeContext";

/* ROOT RENDER */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>

      {/* GLOBAL APP PROVIDERS */}
      <ThemeProvider>

        {/* MAIN APPLICATION */}
        <App />

        {/* GLOBAL TOAST SYSTEM */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 3000,

            style: {
              borderRadius: "10px",
              fontSize: "14px",
              padding: "12px 16px",
              background: "#ffffff",
              color: "#111827",
            },

            success: {
              duration: 2500,
              iconTheme: {
                primary: "#22c55e",
                secondary: "#ffffff",
              },
            },

            error: {
              duration: 3500,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />

      </ThemeProvider>

    </BrowserRouter>
  </React.StrictMode>
);
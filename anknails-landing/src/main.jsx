import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import AboutApp from "./AboutApp.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./index.css";
import "./i18n/i18n.js";

const host = window.location.hostname;
const isAboutPage = host.includes("about.");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 🏠 Головна сторінка */}
        <Route path="/" element={isAboutPage ? <AboutApp /> : <App />} />

        {/* ⚡ Проєкт "About" (якщо відкрити напряму) */}
        <Route path="/about" element={<AboutApp />} />

        {/* ❌ 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// ---- 👇 Пінг для аналітики (Railway backend) ----
try {
  fetch("https://anknails-production.up.railway.app/ping")
    .then(() => console.log("Analytics ping sent"))
    .catch(() => {});
} catch (e) {
  console.warn("Ping error:", e);
}

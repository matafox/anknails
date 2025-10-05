import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AboutApp from "./AboutApp.jsx"; // 👈 сторінка "Про мене"
import "./index.css";
import "./i18n/i18n.js";

// =============================
// 1️⃣ Перевіряємо режим
// =============================
const mode = import.meta.env.VITE_PAGE_MODE;
console.log("🧭 VITE_PAGE_MODE:", mode); // 👈 має показати "about" у консолі Netlify

// =============================
// 2️⃣ Рендеримо правильну сторінку
// =============================
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {mode === "about" ? <AboutApp /> : <App />}
  </React.StrictMode>
);

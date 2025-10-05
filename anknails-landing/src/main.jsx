import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AboutApp from "./AboutApp.jsx"; // ✅ новий компонент
import "./index.css";
import "./i18n/i18n.js";

// 💡 Визначаємо режим сторінки
const mode =
  import.meta.env.VITE_PAGE_MODE || import.meta.env.PAGE_MODE || "main";

// 💡 Якщо це about-сабдомен — рендеримо AboutApp
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {mode === "about" ? <AboutApp /> : <App />}
  </React.StrictMode>
);

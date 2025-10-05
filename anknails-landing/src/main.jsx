import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AboutApp from "./AboutApp.jsx"; // 👈 додай цей імпорт
import "./index.css";
import "./i18n/i18n.js";

// ✅ визначаємо режим (основний або "about")
const mode = import.meta.env.VITE_PAGE_MODE || "main";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {mode === "about" ? <AboutApp /> : <App />}
  </React.StrictMode>
);

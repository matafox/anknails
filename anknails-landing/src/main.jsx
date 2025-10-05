import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AboutApp from "./AboutApp.jsx"; // 👈 твоя сторінка "Про мене"
import "./index.css";
import "./i18n/i18n.js";

const mode = import.meta.env.VITE_PAGE_MODE;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {mode === "about" ? <AboutApp /> : <App />}
  </React.StrictMode>
);

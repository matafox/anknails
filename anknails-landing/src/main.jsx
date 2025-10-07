import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AboutApp from "./AboutApp.jsx";
import "./index.css";
import "./i18n/i18n.js";

const host = window.location.hostname;
const isAboutPage = host.includes("about.");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAboutPage ? <AboutApp /> : <App />}
  </React.StrictMode>
);

// ---- 👇 Пінг для аналітики (Railway backend) ----
try {
  fetch("https://anknails-production.up.railway.app/ping")
    .then(() => console.log("Analytics ping sent"))
    .catch(() => {});
} catch (e) {}

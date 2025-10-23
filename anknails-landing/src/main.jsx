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
    <BrowserRouter basename="/">
      <Routes>
        {isAboutPage ? (
          <>
            <Route path="/" element={<AboutApp />} />
            <Route path="*" element={<NotFound />} />
          </>
        ) : (
          <>
            <Route path="/" element={<App />} />
            <Route path="/about" element={<AboutApp />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// 👇 Пінг до Railway бекенду
try {
  fetch("https://anknails-production.up.railway.app/ping")
    .then(() => console.log("Analytics ping sent"))
    .catch(() => {});
} catch (e) {
  console.warn("Ping error:", e);
}

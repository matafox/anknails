import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import AboutApp from "./AboutApp.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./index.css";
import "./i18n/i18n.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<AboutApp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

try {
  fetch("https://anknails-production.up.railway.app/ping").catch(() => {});
} catch {}

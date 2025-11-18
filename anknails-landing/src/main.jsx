import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CabinetPage from "./pages/CabinetPage.jsx";

import "./index.css";
import "./i18n/i18n.js";

function getBasename() {
  const envBase = import.meta.env.VITE_BASE_PATH;

  if (envBase && envBase !== "/") return envBase;
  if (envBase === "/") return "/";

  if (typeof window === "undefined") return "/";

  const segments = window.location.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "/";

  const first = segments[0];

  if (["login", "admin", "profile"].includes(first)) {
    return "/";
  }

  return `/${first}`;
}

const basename = getBasename();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<CabinetPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CabinetPage from "./pages/CabinetPage.jsx";

import "./index.css";
import "./i18n/i18n.js";

/**
 * Визначаємо basename для BrowserRouter.
 *
 * • Якщо задано VITE_BASE_PATH (типу "/ankstudio") — юзаємо його.
 * • Інакше беремо перший сегмент URL як slug:
 *   pltfrm.life/ankstudio/login -> basename="/ankstudio"
 */
function getBasename() {
  const envBase = import.meta.env.VITE_BASE_PATH;

  if (envBase && envBase !== "/") return envBase;
  if (envBase === "/") return "/";

  if (typeof window === "undefined") return "/";

  const segments = window.location.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "/";

  // перший сегмент = slug платформи
  return `/${segments[0]}`;
}

const basename = getBasename();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        {/* корінь платформи → одразу на логін */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<CabinetPage />} />

        {/* 404 всередині платформи */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

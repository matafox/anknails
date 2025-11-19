import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CabinetPage from "./pages/CabinetPage.jsx";

import "./index.css";
import "./i18n/i18n.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* редірект з кореня на глобальний логін */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 🌍 глобальні маршрути без платформи */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<CabinetPage />} />

        {/* 🧩 ті самі сторінки, але з будь-яким slug платформи */}
        <Route path="/:platformSlug/login" element={<LoginPage />} />
        <Route path="/:platformSlug/admin" element={<AdminPage />} />
        <Route path="/:platformSlug/profile" element={<CabinetPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

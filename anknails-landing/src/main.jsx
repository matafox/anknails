import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import AboutApp from "./AboutApp.jsx";
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
        <Route path="/" element={<App />} />
        <Route path="/about" element={<AboutApp />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/cabinet" element={<CabinetPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

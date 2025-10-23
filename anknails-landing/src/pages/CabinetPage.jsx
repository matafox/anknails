import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, User, Clock } from "lucide-react";

export default function CabinetPage() {
  const { i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    // 🔹 Тема
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    // 🔹 Перевірка токена
    const token = localStorage.getItem("user_token");
    const email = localStorage.getItem("user_email");
    const expires = localStorage.getItem("expires_at");

    if (!token || !email) {
      window.location.href = "/login";
      return;
    }

    setEmail(email);
    setExpiresAt(expires);

    const now = new Date();
    const expDate = new Date(expires);
    const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays);

    if (diffDays <= 0) {
      alert(
        i18n.language === "ru"
          ? "Срок действия аккаунта истек."
          : "Термін дії акаунта закінчився."
      );
      localStorage.clear();
      window.location.href = "/login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py

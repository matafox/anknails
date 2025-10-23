import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Users,
  Image,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";
import ModulesTab from "./ModulesTab";
import BannerTab from "./BannerTab";
import SettingsTab from "./SettingsTab";

export default function AdminPage() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("modules");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔐 Перевірка доступу
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token !== "true") window.location.href = "/login";
  }, []);

  // 🌓 Тема
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/";
  };

  const tabs = [
    { id: "modules", label: i18n.language === "ru" ? "Модули курса" : "Модулі курсу", icon: BookOpen },
    { id: "banner", label: i18n.language === "ru" ? "Баннер" : "Банер", icon: Image },
    { id: "settings", label: i18n.language === "ru" ? "Настройки" : "Налаштування", icon: Settings },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${
        darkMode
          ? "bg-gradient-to-br from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      {/* ☰ Бургер справа */}
      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 bg-pink-500 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* 🩷 Бокове меню */}
      <aside
        className={`fixed md:static top-0 right-0 h-full md:h-auto w-64 p-6 flex flex-col justify-between border-l z-40 transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        } ${
          darkMode
            ? "border-fuchsia-900/30 bg-[#1a0a1f]/80"
            : "border-pink-200 bg-white/80"
        } backdrop-blur-xl`}
      >
        <div>
          <button
            onClick={() => setMenuOpen(false)}
            className="md:hidden text-pink-400 mb-4 self-end"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 text-transparent bg-clip-text mb-6 text-center md:text-left">
            ANK Studio LMS
          </h2>

          <nav className="space-y-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? darkMode
                      ? "bg-pink-500/30 text-fuchsia-100 border border-pink-400/40"
                      : "bg-pink-100 text-pink-700 border border-pink-300"
                    : darkMode
                    ? "hover:bg-fuchsia-900/20 text-fuchsia-200"
                    : "hover:bg-pink-50 text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-pink-500 hover:text-rose-500 transition"
        >
          <LogOut className="w-4 h-4" />
          {i18n.language === "ru" ? "Выйти" : "Вийти"}
        </button>
      </aside>

      {/* 🌸 Контент */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {activeTab === "modules" && (
          <ModulesTab darkMode={darkMode} i18n={i18n} />
        )}
        {activeTab === "banner" && (
          <BannerTab darkMode={darkMode} i18n={i18n} />
        )}
        {activeTab === "settings" && (
          <SettingsTab darkMode={darkMode} i18n={i18n} />
        )}
      </main>
    </div>
  );
}

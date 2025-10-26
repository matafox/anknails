import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Image,
  LogOut,
  Settings,
  Menu,
  X,
  Layers,
  Moon,
  Sun,
  Globe,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Grid,
} from "lucide-react";

import ModulesTab from "./admin/ModulesTab";
import BannerTab from "./admin/BannerTab";
import SettingsTab from "./admin/SettingsTab";
import CoursesTab from "./admin/CoursesTab";
import EarningsTab from "./admin/EarningsTab";
import DashboardTab from "./admin/DashboardTab"; // ✅ новий імпорт

export default function AdminPage() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // 🔐 Перевірка доступу
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token !== "true") window.location.href = "/login";
  }, []);

  // 🌓 Зчитування теми
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // 💾 Відновлення вкладки та стану меню
  useEffect(() => {
    const savedTab = localStorage.getItem("admin_active_tab");
    const savedCollapsed = localStorage.getItem("admin_menu_collapsed");
    if (savedTab) setActiveTab(savedTab);
    if (savedCollapsed === "true") setCollapsed(true);
  }, []);

  // 💾 Збереження вкладки
  useEffect(() => {
    localStorage.setItem("admin_active_tab", activeTab);
  }, [activeTab]);

  // 🌗 Зміна теми
  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  // 🌐 Зміна мови
  const toggleLanguage = () => {
    const newLang = i18n.language === "ru" ? "uk" : "ru";
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);
  };

  // ↔ Зміна стану згортання меню
  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("admin_menu_collapsed", newState);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_active_tab");
    window.location.href = "/";
  };

  // 🧭 Вкладки меню
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Grid },
    { id: "courses", label: i18n.language === "ru" ? "Курсы" : "Курси", icon: Layers },
    { id: "modules", label: i18n.language === "ru" ? "Модули" : "Модулі", icon: BookOpen },
    { id: "banner", label: i18n.language === "ru" ? "Баннер" : "Банер", icon: Image },
    { id: "earnings", label: i18n.language === "ru" ? "Заработок" : "Заробіток", icon: DollarSign },
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
      {/* ☰ Бургер */}
      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 bg-pink-500 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* 🩷 Бокове меню */}
      <aside
        className={`fixed md:static top-0 right-0 h-full md:h-auto flex flex-col justify-between border-l z-40 transition-all duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        ${collapsed ? "w-20 p-4" : "w-64 p-6"}
        ${darkMode ? "border-fuchsia-900/30 bg-[#1a0a1f]/80" : "border-pink-200 bg-white/80"}
        backdrop-blur-xl`}
      >
        <div className="relative flex flex-col justify-between h-full">
          <div>
            {/* Закриття мобільного меню */}
            <button
              onClick={() => setMenuOpen(false)}
              className="md:hidden text-pink-400 mb-4 self-end"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Заголовок */}
            {!collapsed && (
              <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 text-transparent bg-clip-text mb-6 text-center md:text-left">
                ANK Studio LMS
              </h2>
            )}

            {/* Навігація */}
            <nav className="space-y-2 mb-6">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center ${
                    collapsed ? "justify-center" : "gap-3"
                  } w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === id
                      ? darkMode
                        ? "bg-pink-500/30 text-fuchsia-100 border border-pink-400/40"
                        : "bg-pink-100 text-pink-700 border border-pink-300"
                      : darkMode
                      ? "hover:bg-fuchsia-900/20 text-fuchsia-200"
                      : "hover:bg-pink-50 text-gray-700"
                  }`}
                  title={collapsed ? label : ""}
                >
                  <Icon className="w-4 h-4" />
                  {!collapsed && label}
                </button>
              ))}
            </nav>

            {/* 🌗 Тема */}
            <button
              onClick={toggleTheme}
              className={`flex items-center ${
                collapsed ? "justify-center" : "gap-2"
              } w-full px-4 py-2 rounded-lg border text-sm mb-3 transition-all hover:scale-[1.02]
              border-pink-300 text-pink-600 dark:border-fuchsia-800 dark:text-fuchsia-200`}
              title={collapsed ? (darkMode ? "Світла тема" : "Темна тема") : ""}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {!collapsed &&
                (darkMode
                  ? i18n.language === "ru"
                    ? "Светлая тема"
                    : "Світла тема"
                  : i18n.language === "ru"
                  ? "Тёмная тема"
                  : "Темна тема")}
            </button>

            {/* 🌐 Мова */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center ${
                collapsed ? "justify-center" : "gap-2"
              } w-full px-4 py-2 rounded-lg border text-sm transition-all hover:scale-[1.02]
              border-pink-300 text-pink-600 dark:border-fuchsia-800 dark:text-fuchsia-200`}
              title={collapsed ? (i18n.language === "ru" ? "Українська" : "Русский") : ""}
            >
              <Globe className="w-4 h-4" />
              {!collapsed && (i18n.language === "ru" ? "Українська" : "Русский")}
            </button>
          </div>

{/* Нижній блок */}
<div className="mt-8 flex flex-col items-center gap-3">
  {/* ↔ Кнопка згортання */}
  <button
    onClick={toggleCollapse}
    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-[1.03]
    border-pink-300 text-pink-500 dark:border-fuchsia-800 dark:text-fuchsia-200`}
  >
    {collapsed ? (
      <>
        <ChevronRight className="w-4 h-4" />
        {!collapsed && "Розгорнути"}
      </>
    ) : (
      <>
        <ChevronLeft className="w-4 h-4" />
        {!collapsed && (i18n.language === "ru" ? "Свернуть меню" : "Згорнути меню")}
      </>
    )}
  </button>

  {/* 🚪 Вихід */}
  <button
    onClick={handleLogout}
    className={`flex items-center justify-center gap-2 text-sm font-semibold text-pink-500 hover:text-rose-500 transition`}
  >
    <LogOut className="w-4 h-4" />
    {!collapsed && (i18n.language === "ru" ? "Выйти" : "Вийти")}
  </button>
</div>
        </div>
      </aside>

      {/* 🌸 Контент */}
      <main className="flex-1 flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
        <div className="flex-1 overflow-y-auto">
          {activeTab === "dashboard" && (
            <DashboardTab darkMode={darkMode} i18n={i18n} setActiveTab={setActiveTab} />
          )}
          {activeTab === "courses" && <CoursesTab darkMode={darkMode} i18n={i18n} />}
          {activeTab === "modules" && <ModulesTab darkMode={darkMode} i18n={i18n} />}
          {activeTab === "banner" && <BannerTab darkMode={darkMode} i18n={i18n} />}
          {activeTab === "earnings" && <EarningsTab darkMode={darkMode} i18n={i18n} />}
          {activeTab === "settings" && <SettingsTab darkMode={darkMode} i18n={i18n} />}
        </div>

        {/* ⚙️ Footer */}
        <footer
          className={`text-center py-5 text-sm border-t mt-auto ${
            darkMode
              ? "border-fuchsia-900/30 text-fuchsia-100/80"
              : "border-pink-200 text-gray-600"
          }`}
        >
          <p className="font-medium">
            © {new Date().getFullYear()}{" "}
            <span className="text-pink-500 font-semibold">ANK Studio LMS</span> •{" "}
            {i18n.language === "ru" ? "Все права защищены." : "Усі права захищені."}
          </p>
        </footer>
      </main>
    </div>
  );
}

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
  BarChart3,
  Eye,
} from "lucide-react";

import ModulesTab from "./admin/ModulesTab";
import BannerTab from "./admin/BannerTab";
import SettingsTab from "./admin/SettingsTab";
import CoursesTab from "./admin/CoursesTab";
import EarningsTab from "./admin/EarningsTab";
import DashboardTab from "./admin/DashboardTab";
import TrafficTab from "./admin/TrafficTab";
import PreviewTab from "./admin/PreviewTab";

import { usePlatform, getCurrentSlug } from "../hooks/usePlatform";

export default function AdminPage() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // 🔹 платформа зі slug (ankstudio / english / ...)
  const {
    platform,
    slug,
    loading: platformLoading,
    error: platformError,
  } = usePlatform();

  // 🔐 перевірка адмін-токена
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token !== "true") {
      const s = getCurrentSlug();
      if (s) {
        window.location.href = `/${s}/login`;
      } else {
        window.location.href = "/login";
      }
    }
  }, []);

  // 🎨 тема
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // 📌 активна вкладка + стан меню
  useEffect(() => {
    const savedTab = localStorage.getItem("admin_active_tab");
    const savedCollapsed = localStorage.getItem("admin_menu_collapsed");
    if (savedTab) setActiveTab(savedTab);
    if (savedCollapsed === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("admin_active_tab", activeTab);
  }, [activeTab]);

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "ru" ? "uk" : "ru";
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);
  };

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("admin_menu_collapsed", newState);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_active_tab");
    const s = getCurrentSlug();
    if (s) {
      window.location.href = `/${s}/login`;
    } else {
      window.location.href = "/login";
    }
  };

  // 🧭 Навігація
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Grid },
    {
      id: "preview",
      label: i18n.language === "ru" ? "Превью ученика" : "Превʼю учня",
      icon: Eye,
      badge: "NEW",
    },
    { id: "courses", label: i18n.language === "ru" ? "Курсы" : "Курси", icon: Layers },
    { id: "modules", label: i18n.language === "ru" ? "Модули" : "Модулі", icon: BookOpen },
    { id: "banner", label: i18n.language === "ru" ? "Баннер" : "Банер", icon: Image },
    { id: "earnings", label: i18n.language === "ru" ? "Заработок" : "Заробіток", icon: DollarSign },
    {
      id: "traffic",
      label: i18n.language === "ru" ? "Трафик" : "Трафік",
      icon: BarChart3,
      badge: "NEW",
    },
    { id: "settings", label: i18n.language === "ru" ? "Настройки" : "Налаштування", icon: Settings },
  ];

  const brandName = platform?.name || "ANK Studio LMS";
  const brandAccent = platform?.color || (darkMode ? "#f97316" : "#ec4899");
  const brandLogo = platform?.logo || null;

  // ⏳ якщо є slug – чекаємо платформу
  if (slug && platformLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080810] text-white">
        <div className="text-center space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] opacity-60">
            pltfrm.life
          </div>
          <div className="text-lg font-semibold">
            Завантаження платформи <span className="opacity-70">({slug})</span>…
          </div>
        </div>
      </div>
    );
  }

  // ❌ помилка платформи
  if (slug && platformError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080810] text-white px-4">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-bold">Платформа недоступна</h1>
          <p>{platformError}</p>
          <p className="text-sm opacity-70">
            Перевір, що платформа зі slug <strong>{slug}</strong> існує та активна в адмінці pltfrm.life.
          </p>
        </div>
      </div>
    );
  }

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

      {/* Бокове меню */}
      <aside
        className={`fixed md:static top-0 right-0 h-full md:h-auto flex flex-col justify-between border-l z-40 transition-all duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        ${collapsed ? "w-20 p-4" : "w-64 p-6"}
        ${darkMode ? "border-fuchsia-900/30 bg-[#1a0a1f]/80" : "border-pink-200 bg-white/80"}
        backdrop-blur-xl`}
      >
        <div className="relative flex flex-col justify-between h-full">
          <div>
            <button onClick={() => setMenuOpen(false)} className="md:hidden text-pink-400 mb-4 self-end">
              <X className="w-5 h-5" />
            </button>

            {!collapsed && (
              <div className="flex items-center gap-3 mb-6">
                {brandLogo && (
                  <img
                    src={brandLogo}
                    alt={brandName}
                    className="w-9 h-9 rounded-xl object-cover border border-pink-200/60 dark:border-fuchsia-700/60"
                  />
                )}
                <div>
                  <h2
                    className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400"
                    style={brandLogo ? {} : { backgroundImage: `linear-gradient(90deg, ${brandAccent}, #ec4899)` }}
                  >
                    {brandName}
                  </h2>
                  {slug && (
                    <p className="text-xs uppercase tracking-[0.2em] opacity-60">
                      slug: {slug}
                    </p>
                  )}
                </div>
              </div>
            )}

            <nav className="space-y-2 mb-6">
              {tabs.map(({ id, label, icon: Icon, badge }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setMenuOpen(false);
                  }}
                  className={`relative flex items-center ${
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
                  {badge && (
                    <span
                      className={`absolute right-3 top-1.5 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide
                      ${darkMode ? "bg-fuchsia-600/90 text-white" : "bg-pink-500 text-white"}`}
                    >
                      {badge}
                    </span>
                  )}

                  <Icon className="w-4 h-4" />
                  {!collapsed && <span>{label}</span>}
                </button>
              ))}
            </nav>

            <button
              onClick={toggleTheme}
              className={`flex items-center ${collapsed ? "justify-center" : "gap-2"} w-full px-4 py-2 rounded-lg border text-sm mb-3 transition-all hover:scale-[1.02]
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

            <button
              onClick={toggleLanguage}
              className={`flex items-center ${collapsed ? "justify-center" : "gap-2"} w-full px-4 py-2 rounded-lg border text-sm transition-all hover:scale-[1.02]
              border-pink-300 text-pink-600 dark:border-fuchsia-800 dark:text-fuchsia-200`}
              title={collapsed ? (i18n.language === "ru" ? "Українська" : "Русский") : ""}
            >
              <Globe className="w-4 h-4" />
              {!collapsed && (i18n.language === "ru" ? "Українська" : "Русский")}
            </button>

            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                onClick={toggleCollapse}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-[1.03]
                border-pink-300 text-pink-500 dark:border-fuchsia-800 dark:text-fuchsia-200`}
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                {!collapsed && (i18n.language === "ru" ? "Свернуть меню" : "Згорнути меню")}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-pink-500 hover:text-rose-500 transition"
              >
                <LogOut className="w-4 h-4" />
                {!collapsed && (i18n.language === "ru" ? "Выйти" : "Вийти")}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Контент */}
      <main className="flex-1 flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
        <div className="flex-1 overflow-y-auto">
          {activeTab === "dashboard" && (
            <DashboardTab darkMode={darkMode} i18n={i18n} setActiveTab={setActiveTab} platform={platform} />
          )}
          {activeTab === "preview" && <PreviewTab darkMode={darkMode} platform={platform} />}
          {activeTab === "traffic" && <TrafficTab darkMode={darkMode} i18n={i18n} platform={platform} />}
          {activeTab === "courses" && <CoursesTab darkMode={darkMode} i18n={i18n} platform={platform} />}
          {activeTab === "modules" && <ModulesTab darkMode={darkMode} i18n={i18n} platform={platform} />}
          {activeTab === "banner" && <BannerTab darkMode={darkMode} i18n={i18n} platform={platform} />}
          {activeTab === "earnings" && <EarningsTab darkMode={darkMode} i18n={i18n} platform={platform} />}
          {activeTab === "settings" && <SettingsTab darkMode={darkMode} i18n={i18n} platform={platform} />}
        </div>

        <footer
          className={`text-center py-5 text-sm mt-auto ${
            darkMode ? "text-fuchsia-100/80" : "text-gray-600"
          }`}
        >
          <p className="font-medium">
            © {new Date().getFullYear()}{" "}
            <span className="text-pink-500 font-semibold">{brandName}</span> •{" "}
            {i18n.language === "ru" ? "Все права защищены." : "Усі права захищені."}
          </p>
        </footer>
      </main>
    </div>
  );
}

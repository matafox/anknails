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
  BarChart3, // іконка для Traffic
  Eye,       // превʼю
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";

import ModulesTab from "./admin/ModulesTab";
import BannerTab from "./admin/BannerTab";
import SettingsTab from "./admin/SettingsTab";
import CoursesTab from "./admin/CoursesTab";
import EarningsTab from "./admin/EarningsTab";
import DashboardTab from "./admin/DashboardTab";
import TrafficTab from "./admin/TrafficTab";

const BACKEND = "https://anknails-backend-production.up.railway.app";
// Що показуємо в превʼю (кабінет учениці)
const FRONT_PREVIEW_URL = "/profile";

export default function AdminPage() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Стан для превʼю
  const [previewMode, setPreviewMode] = useState("mobile"); // desktop | tablet | mobile
  const [previewUser, setPreviewUser] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewInitialized, setPreviewInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token !== "true") window.location.href = "/login";
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

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
    window.location.href = "/";
  };

  // 🧭 Навігація (додали preview з плашкою NEW)
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
    { id: "traffic", label: i18n.language === "ru" ? "Трафик" : "Трафік", icon: BarChart3, badge: "NEW" },
    { id: "settings", label: i18n.language === "ru" ? "Настройки" : "Налаштування", icon: Settings },
  ];

  // 📌 ініціалізація превʼю: логінимось під юзером з id = 2
  useEffect(() => {
    const initPreview = async () => {
      try {
        setPreviewLoading(true);
        setPreviewError("");

        const TEST_USER_ID = 2;

        const resUsers = await fetch(`${BACKEND}/api/users`);
        const dataUsers = await resUsers.json();

        const users = dataUsers?.users || [];
        const testUser = users.find((u) => u.id === TEST_USER_ID);

        if (!testUser) {
          throw new Error(
            i18n.language === "ru"
              ? `Пользователь с id=${TEST_USER_ID} не найден.`
              : `Користувача з id=${TEST_USER_ID} не знайдено.`
          );
        }

        const loginRes = await fetch(`${BACKEND}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: testUser.email,
            password: testUser.password,
            lang: i18n.language,
          }),
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) {
          throw new Error(
            loginData.detail ||
              (i18n.language === "ru"
                ? "Не удалось залогинить превью-пользователя."
                : "Не вдалось залогінити превʼю-користувача.")
          );
        }

        const u = loginData.user;

        localStorage.setItem("user_token", "true");
        localStorage.setItem("user_email", u.email);
        if (u.expires_at) localStorage.setItem("expires_at", u.expires_at);
        if (loginData.session_token) {
          localStorage.setItem("session_token", loginData.session_token);
        }

        setPreviewUser(u);
      } catch (err) {
        setPreviewError(err.message || "Preview error");
      } finally {
        setPreviewLoading(false);
        setPreviewInitialized(true);
      }
    };

    if (activeTab === "preview" && !previewInitialized && !previewLoading) {
      initPreview();
    }
  }, [activeTab, previewInitialized, previewLoading, i18n.language]);

  const previewWrapperClass =
    previewMode === "desktop"
      ? "w-full max-w-5xl h-[720px]"
      : previewMode === "tablet"
      ? "w-[820px] max-w-full h-[720px]"
      : "w-[420px] max-w-full h-[760px]";

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
              <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 text-transparent bg-clip-text mb-6 text-center md:text-left">
                ANK Studio LMS
              </h2>
            )}

            <nav className="space-y-2 mb-6">
              {tabs.map(({ id, label, icon: Icon, badge }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setMenuOpen(false);
                  }}
                  className={`relative flex items-center ${collapsed ? "justify-center" : "gap-3"} w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
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

            {/* Нижній блок */}
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
            <DashboardTab darkMode={darkMode} i18n={i18n} setActiveTab={setActiveTab} />
          )}
          {activeTab === "traffic" && <TrafficTab darkMode={darkMode} i18n={i18n} />}
          {activeTab === "courses" && <CoursesTab darkMode={darkMode} i18n={i18n} />}
          {activeTab === "modules" && <ModulesTab darkMode={darkMode} i18n={i18n} />}
          {activeTab === "banner" && <BannerTab darkMode={darkMode} i18n={i18n} />}
          {activeTab === "earnings" && <EarningsTab darkMode={darkMode} i18n={i18n} />}
          {activeTab === "settings" && <SettingsTab darkMode={darkMode} i18n={i18n} />}

          {/* 🆕 PREVIEW TAB */}
          {activeTab === "preview" && (
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                    <Eye className="w-5 h-5 text-pink-500" />
                    {i18n.language === "ru" ? "Как видит сайт ученик" : "Як бачить сайт учень"}
                  </h1>
                  <p className="text-sm opacity-80 mt-1">
                    {i18n.language === "ru"
                      ? "Здесь загружается реальный кабинет /profile под пользователем с id=2."
                      : "Тут завантажується реальний кабінет /profile під користувачем з id=2."}
                  </p>
                  {previewUser && (
                    <p className="text-xs mt-1 opacity-70">
                      {i18n.language === "ru"
                        ? `Сейчас превью под: ${previewUser.email}`
                        : `Зараз превʼю під: ${previewUser.email}`}
                    </p>
                  )}
                </div>

                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-1 border text-xs sm:text-sm shadow-sm ${
                    darkMode
                      ? "bg-white/5 border-fuchsia-900/40 text-fuchsia-100"
                      : "bg-white/80 border-pink-200 text-gray-700"
                  }`}
                >
                  <span className="px-2 opacity-70">
                    {i18n.language === "ru" ? "Режим:" : "Режим:"}
                  </span>

                  <button
                    onClick={() => setPreviewMode("desktop")}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full transition text-xs sm:text-sm ${
                      previewMode === "desktop"
                        ? darkMode
                          ? "bg-pink-500/80 text-white"
                          : "bg-pink-500 text-white"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>

                  <button
                    onClick={() => setPreviewMode("tablet")}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full transition text-xs sm:text-sm ${
                      previewMode === "tablet"
                        ? darkMode
                          ? "bg-pink-500/80 text-white"
                          : "bg-pink-500 text-white"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Tablet className="w-4 h-4" />
                    <span className="hidden sm:inline">Tablet</span>
                  </button>

                  <button
                    onClick={() => setPreviewMode("mobile")}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full transition text-xs sm:text-sm ${
                      previewMode === "mobile"
                        ? darkMode
                          ? "bg-pink-500/80 text-white"
                          : "bg-pink-500 text-white"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>
              </div>

              {previewLoading && (
                <div className="w-full flex justify-center items-center py-12">
                  <div className="animate-pulse text-sm opacity-70">
                    {i18n.language === "ru"
                      ? "Загружаем превью ученика..."
                      : "Завантажуємо превʼю учня..."}
                  </div>
                </div>
              )}

              {previewError && !previewLoading && (
                <div
                  className={`w-full max-w-xl mx-auto text-center text-sm px-4 py-3 rounded-2xl border ${
                    darkMode
                      ? "border-rose-500/60 text-rose-200 bg-rose-900/20"
                      : "border-rose-400 text-rose-700 bg-rose-50"
                  }`}
                >
                  {previewError}
                </div>
              )}

              {!previewLoading && !previewError && (
                <>
                  <div className="w-full flex justify-center">
                    <div className={`${previewWrapperClass} flex items-center justify-center`}>
                      <div
                        className={`relative w-full h-full overflow-hidden rounded-3xl shadow-2xl border ${
                          darkMode
                            ? "bg-black border-fuchsia-900/50"
                            : "bg-gray-900 border-pink-200/80"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 px-4 py-2 border-b text-xs ${
                            darkMode
                              ? "border-fuchsia-900/60 bg-black/70 text-fuchsia-100/70"
                              : "border-pink-200/80 bg-gray-50 text-gray-600"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                          </div>
                          <div className="flex-1 flex justify-center">
                            <span
                              className={`px-3 py-1 rounded-full max-w-[70%] truncate ${
                                darkMode ? "bg-white/5" : "bg-white"
                              }`}
                            >
                              {typeof window !== "undefined"
                                ? window.location.origin
                                : "https://ankstudio.online"}
                              {FRONT_PREVIEW_URL !== "/" ? FRONT_PREVIEW_URL : ""}
                            </span>
                          </div>
                        </div>

                        <iframe
                          key={previewUser ? previewUser.email : "preview-iframe"}
                          src={FRONT_PREVIEW_URL}
                          title="User preview"
                          className="w-full h-[calc(100%-40px)] border-0 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs opacity-60 mt-2 text-center">
                    {i18n.language === "ru"
                      ? "Сейчас превью всегда открывается под пользователем с id=2. Для боевого режима можно будет добавить выбор ученика."
                      : "Зараз превʼю завжди відкривається під користувачем з id=2. Для бойового режиму можна буде додати вибір учениці."}
                  </p>
                </>
              )}
            </section>
          )}
        </div>

        <footer
          className={`text-center py-5 text-sm mt-auto ${
            darkMode ? "text-fuchsia-100/80" : "text-gray-600"
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

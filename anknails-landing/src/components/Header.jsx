import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, Sun, Moon, Settings, LogOut } from "lucide-react";

const HDR_H_MOBILE = 64;   // px (h-16)
const HDR_H_DESKTOP = 80;  // px (h-20)

export default function Header({ onMenuToggle }) {
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ локальний хелпер для RU/UK
  const T = (ua, ru) => (i18n.language === "ru" ? ru : ua);

  useEffect(() => {
    try {
      setIsAdmin(localStorage.getItem("admin_token") === "true");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = saved === "dark" || (!saved && prefersDark);
      setDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    } catch {}
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const v = !darkMode;
    setDarkMode(v);
    document.documentElement.classList.toggle("dark", v);
    try {
      localStorage.setItem("theme", v ? "dark" : "light");
    } catch {}
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem("lang", lng);
    } catch {}
  };

  const toggleMenu = () => {
    const v = !menuOpen;
    setMenuOpen(v);
    onMenuToggle?.(v);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("admin_token");
    } catch {}
    window.location.href = "/";
  };

  return (
    <>
      {/* ФІКСОВАНИЙ ХЕДЕР */}
      <header
        className={`fixed inset-x-0 top-0 z-[9999] 
          ${
            scrolled
              ? "backdrop-blur-xl bg-white/80 dark:bg-black/40 shadow-[0_2px_24px_rgba(255,0,128,0.15)] border-b border-pink-400/10"
              : "bg-white/60 dark:bg-black/30 backdrop-blur-xl border-b border-transparent"
          }
        `}
      >
        <div className="h-16 md:h-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
            {/* ЛОГО зліва */}
            <button
              onClick={() => (window.location.href = "https://ankstudio.online")}
              className="text-2xl sm:text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400"
            >
              ANK Studio
            </button>

            {/* Центр — навігація (десктоп) */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700 dark:text-fuchsia-100">
              <a href="#modules" className="hover:text-pink-500">
                {T("Модулі", "Модули")}
              </a>
              <a href="#forwhom" className="hover:text-pink-500">
                {T("Для кого курс", "Для кого курс")}
              </a>
              <a href="#tariffs" className="hover:text-pink-500">
                {T("Тарифи", "Тарифы")}
              </a>
              <a href="#faq" className="hover:text-pink-500">FAQ</a>
            </nav>

            {/* Праворуч */}
            <div className="flex items-center gap-2">
              {/* Тема — і моб, і десктоп */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white/50 dark:bg-white/10 border border-white/30"
                aria-label="theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Мова — лише десктоп; на мобілці перенесено в меню */}
              <div className="hidden sm:flex items-center gap-1">
                {["ru", "uk"].map((l) => (
                  <button
                    key={l}
                    onClick={() => changeLanguage(l)}
                    className={`px-2.5 py-1 text-xs rounded-lg border ${
                      i18n.language === l
                        ? "bg-pink-500 text-white border-pink-500"
                        : "bg-white/70 dark:bg-white/10 text-gray-700 dark:text-fuchsia-100 border-pink-200"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Доступ / Адмін — тільки десктоп */}
              {isAdmin ? (
                <>
                  <a
                    href="/admin"
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-pink-500 to-rose-500"
                  >
                    <Settings className="w-4 h-4" />
                    {T("Адмін панель", "Админ панель")}
                  </a>
                  <button
                    onClick={handleLogout}
                    className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-pink-600 hover:text-rose-500"
                  >
                    <LogOut className="w-4 h-4" />
                    {T("Вийти", "Выйти")}
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-pink-500 to-rose-500"
                >
                  {T("Доступ до платформи", "Доступ к платформе")}
                </a>
              )}

              {/* Бургер — мобілка */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-xl bg-white/50 dark:bg-white/10 border border-white/30"
                aria-label="menu"
              >
                {menuOpen ? (
                  <X className="w-6 h-6 text-pink-500" />
                ) : (
                  <Menu className="w-6 h-6 text-pink-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Спейсер під фіксований хедер */}
      <div className="h-16 md:h-20" aria-hidden />

      {/* Мобільний дропдаун (під хедером) */}
      {menuOpen && (
        <div className="fixed top-16 md:top-20 inset-x-0 z-[9998] bg-white/95 dark:bg-[#0c0016]/95 backdrop-blur-xl border-b border-pink-200/40 dark:border-fuchsia-900/30">
          <div className="max-w-7xl mx-auto px-4 py-4 grid gap-2">
            <a
              href="#modules"
              onClick={() => setMenuOpen(false)}
              className="py-3 font-semibold"
            >
              {T("Модулі", "Модули")}
            </a>
            <a
              href="#forwhom"
              onClick={() => setMenuOpen(false)}
              className="py-3 font-semibold"
            >
              {T("Для кого курс", "Для кого курс")}
            </a>
            <a
              href="#tariffs"
              onClick={() => setMenuOpen(false)}
              className="py-3 font-semibold"
            >
              {T("Тарифи", "Тарифы")}
            </a>
            <a
              href="#faq"
              onClick={() => setMenuOpen(false)}
              className="py-3 font-semibold"
            >
              FAQ
            </a>

            {/* RU / UK по центру */}
            <div className="mt-2 pt-3 border-t border-pink-200/40 dark:border-fuchsia-900/30">
              <div className="flex items-center justify-center gap-3">
                {["ru", "uk"].map((lng) => (
                  <button
                    key={lng}
                    onClick={() => {
                      changeLanguage(lng);
                      setMenuOpen(false);
                    }}
                    className={`px-4 py-1.5 text-sm rounded-lg border font-semibold
                      ${
                        i18n.language === lng
                          ? "bg-pink-500 text-white border-pink-500 shadow-[0_0_10px_rgba(255,0,128,0.35)]"
                          : "bg-pink-50 text-gray-700 border-pink-200 hover:bg-pink-100"
                      }`}
                  >
                    {lng.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Доступ/Адмін — мобілка */}
            <div className="mt-3">
              {isAdmin ? (
                <>
                  <a
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl text-white bg-gradient-to-r from-pink-500 to-rose-500"
                  >
                    <Settings className="w-4 h-4" />
                    {T("Адмін панель", "Админ панель")}
                  </a>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="mt-2 w-full py-3 text-pink-600 font-semibold"
                  >
                    {T("Вийти", "Выйти")}
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center px-4 py-3 rounded-xl text-white bg-gradient-to-r from-pink-500 to-rose-500"
                >
                  {T("Доступ до платформи", "Доступ к платформе")}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

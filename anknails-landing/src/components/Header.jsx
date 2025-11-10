import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, Sun, Moon, Globe, Settings, LogOut } from "lucide-react";

const HDR_H_MOBILE = 64;   // px (h-16)
const HDR_H_DESKTOP = 80;  // px (h-20)

export default function Header({ onMenuToggle }) {
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => setIsAdmin(localStorage.getItem("admin_token") === "true"), []);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const v = !darkMode;
    setDarkMode(v);
    document.documentElement.classList.toggle("dark", v);
    localStorage.setItem("theme", v ? "dark" : "light");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  const toggleMenu = () => {
    const v = !menuOpen;
    setMenuOpen(v);
    onMenuToggle?.(v);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/";
  };

  return (
    <>
      {/* ФІКСОВАНИЙ ХЕДЕР */}
      <header
        className={`fixed inset-x-0 top-0 z-[9999] 
          ${scrolled
            ? "backdrop-blur-xl bg-white/80 dark:bg-black/40 shadow-[0_2px_24px_rgba(255,0,128,0.15)] border-b border-pink-400/10"
            : "bg-white/60 dark:bg-black/30 backdrop-blur-xl border-b border-transparent"}
        `}
      >
        {/* стабільна висота */}
        <div className="h-16 md:h-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
            {/* ЛОГО ЗЛІВА */}
            <button
              onClick={() => (window.location.href = "https://ankstudio.online")}
              className="text-2xl sm:text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400"
            >
              ANK Studio
            </button>

            {/* ЦЕНТРАЛЬНЕ НАВ (опц.) – вирівняне по центру */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700 dark:text-fuchsia-100">
              <a href="#modules" className="hover:text-pink-500">Модулі</a>
              <a href="#forwhom" className="hover:text-pink-500">Для кого курс</a>
              <a href="#tariffs" className="hover:text-pink-500">Тарифи</a>
              <a href="#faq" className="hover:text-pink-500">FAQ</a>
            </nav>

            {/* ПРАВОРУЧ: мова, тема, доступ */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white/50 dark:bg-white/10 border border-white/30"
                aria-label="theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {["ru","uk"].map(l => (
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

              {isAdmin ? (
                <>
                  <a
                    href="/admin"
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-pink-500 to-rose-500"
                  >
                    <Settings className="w-4 h-4" />
                    {i18n.language === "ru" ? "Админ панель" : "Адмін панель"}
                  </a>
                  <button
                    onClick={handleLogout}
                    className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-pink-600 hover:text-rose-500"
                  >
                    <LogOut className="w-4 h-4" />
                    {i18n.language === "ru" ? "Выйти" : "Вийти"}
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-pink-500 to-rose-500"
                >
                  {i18n.language === "ru" ? "Доступ к платформе" : "Доступ до платформи"}
                </a>
              )}

              {/* Кнопка меню (мобільно) */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-xl bg-white/50 dark:bg-white/10 border border-white/30"
                aria-label="menu"
              >
                {menuOpen ? <X className="w-6 h-6 text-pink-500" /> : <Menu className="w-6 h-6 text-pink-400" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* СПЕЙСЕР ПІД ФІКСОВАНИЙ ХЕДЕР */}
      <div className="h-16 md:h-20" aria-hidden />

      {/* Мобільний дропдаун (під хедером, теж фіксований) */}
      {menuOpen && (
        <div className="fixed top-16 md:top-20 inset-x-0 z-[9998] bg-white/95 dark:bg-[#0c0016]/95 backdrop-blur-xl border-b border-pink-200/40">
          <div className="max-w-7xl mx-auto px-4 py-4 grid gap-2">
            <a href="#modules" onClick={() => setMenuOpen(false)} className="py-3 font-semibold">Модулі</a>
            <a href="#forwhom" onClick={() => setMenuOpen(false)} className="py-3 font-semibold">Для кого курс</a>
            <a href="#tariffs"  onClick={() => setMenuOpen(false)} className="py-3 font-semibold">Тарифи</a>
            <a href="#faq"      onClick={() => setMenuOpen(false)} className="py-3 font-semibold">FAQ</a>

            {isAdmin ? (
              <>
                <a href="/admin" className="mt-2 inline-flex items-center gap-2 px-4 py-3 rounded-xl text-white bg-gradient-to-r from-pink-500 to-rose-500">
                  <Settings className="w-4 h-4" /> {i18n.language === "ru" ? "Админ панель" : "Адмін панель"}
                </a>
                <button onClick={handleLogout} className="py-3 text-pink-600">{i18n.language === "ru" ? "Выйти" : "Вийти"}</button>
              </>
            ) : (
              <a href="/login" className="mt-2 inline-flex items-center justify-center px-4 py-3 rounded-xl text-white bg-gradient-to-r from-pink-500 to-rose-500">
                {i18n.language === "ru" ? "Доступ к платформе" : "Доступ до платформи"}
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}

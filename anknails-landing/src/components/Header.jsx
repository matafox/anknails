import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, Sun, Moon, Globe, Settings, LogOut } from "lucide-react";

export default function Header({ onMenuToggle }) {
  const { i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const tr = (ua, ru) => (i18n.language === "ru" ? ru : ua);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("admin_token") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAdmin(false);
    window.location.href = "/";
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
        onMenuToggle?.(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        onMenuToggle?.(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, onMenuToggle]);

  const toggleDropdown = () => {
    const next = !open;
    setOpen(next);
    onMenuToggle?.(next);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
    onMenuToggle?.(false);
  };

  const items =
    i18n.language === "ru"
      ? [
          { label: "Модули", id: "modules" },
          { label: "Для кого курс", id: "forwhom" },
          { label: "Тарифы", id: "tariffs" },
          { label: "FAQ", id: "faq" },
        ]
      : [
          { label: "Модулі", id: "modules" },
          { label: "Для кого курс", id: "forwhom" },
          { label: "Тарифи", id: "tariffs" },
          { label: "FAQ", id: "faq" },
        ];

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-[100] transition-all ${
        scrolled
          ? "backdrop-blur-xl bg-white/80 dark:bg-black/40 border-b border-pink-400/10 shadow-[0_2px_20px_rgba(244,63,94,.12)]"
          : "bg-transparent"
      }`}
    >
      {/* ====== Верхній ряд: ліво/центр/право ====== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-3">
        {/* ЛІВО — ЛОГО */}
        <button
          onClick={() => (window.location.href = "https://ankstudio.online")}
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400"
          aria-label="ANK Studio"
        >
          ANK Studio
        </button>

        {/* ЦЕНТР — навігація + тема + мова */}
        <div className="hidden md:flex items-center justify-center gap-6">
          <nav className="flex items-center gap-6">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => scrollTo(it.id)}
                className="text-sm font-semibold text-gray-700/90 dark:text-fuchsia-100/90 hover:text-pink-600 dark:hover:text-pink-300 transition"
              >
                {it.label}
              </button>
            ))}
          </nav>

          <span className="h-5 w-px bg-pink-200/60 dark:bg-fuchsia-900/40" />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-pink-200/40 bg-white/50 dark:bg-white/10 dark:border-fuchsia-900/30 hover:scale-[1.05] transition"
            title={darkMode ? tr("Світла тема", "Светлая тема") : tr("Темна тема", "Тёмная тема")}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-1 rounded-xl border border-pink-200/40 bg-white/50 dark:bg-white/10 dark:border-fuchsia-900/30 p-1">
            {["ru", "uk"].map((lng) => (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  i18n.language === lng
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow"
                    : "text-gray-700 dark:text-fuchsia-100 hover:bg-pink-50/70 dark:hover:bg-white/10"
                }`}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ПРАВО — CTA / Адмін */}
        <div className="flex items-center gap-2 justify-end">
          {/* Desktop CTA / Admin */}
          {!isAdmin ? (
            <a
              href="/login"
              className="hidden md:inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 shadow"
            >
              {tr("Доступ до платформи", "Доступ к платформе")}
            </a>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <a
                href="/admin"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 shadow"
              >
                <Settings className="w-4 h-4" />
                {tr("Адмін панель", "Админ панель")}
              </a>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-pink-600 dark:text-pink-300 hover:bg-pink-50/80 dark:hover:bg-white/10 transition"
              >
                <LogOut className="w-4 h-4 inline mr-1" />
                {tr("Вийти", "Выйти")}
              </button>
            </div>
          )}

          {/* Mobile: бургер + маленький CTA */}
          {!isAdmin && (
            <a
              href="/login"
              className="md:hidden inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500"
            >
              {tr("Доступ", "Доступ")}
            </a>
          )}
          <button
            onClick={toggleDropdown}
            className="md:hidden p-2 rounded-xl bg-white/60 dark:bg-white/10 border border-white/30 hover:scale-[1.05] transition"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6 text-pink-500" /> : <Menu className="w-6 h-6 text-pink-400" />}
          </button>
        </div>
      </div>

      {/* ====== Mobile dropdown під хедером ====== */}
      {open && (
        <div ref={panelRef} className="md:hidden absolute top-16 left-0 right-0 z-50">
          <div className="mx-3 rounded-2xl border border-pink-200/50 dark:border-fuchsia-900/40 bg-white/80 dark:bg-[#0c0016]/85 backdrop-blur-xl shadow-xl p-2">
            <div className="flex flex-col py-1">
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => scrollTo(it.id)}
                  className="text-left px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 dark:text-fuchsia-100 hover:bg-pink-50/80 dark:hover:bg-white/10 transition"
                >
                  {it.label}
                </button>
              ))}
            </div>

            <div className="my-2 h-px bg-pink-200/50 dark:bg-fuchsia-900/40" />

            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4" />
                {["ru", "uk"].map((lng) => (
                  <button
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    className={`px-2.5 py-1 rounded-md font-semibold text-xs transition ${
                      i18n.language === lng
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                        : "text-gray-700 dark:text-fuchsia-100 hover:bg-pink-50/70 dark:hover:bg-white/10"
                    }`}
                  >
                    {lng.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-pink-200/40 dark:border-fuchsia-900/40"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <div className="px-3 pb-2">
              {!isAdmin ? (
                <a
                  href="/login"
                  className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500"
                >
                  {tr("Доступ до платформи", "Доступ к платформе")}
                </a>
              ) : (
                <div className="flex items-center gap-2">
                  <a
                    href="/admin"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500"
                  >
                    <Settings className="w-4 h-4" />
                    {tr("Адмін панель", "Админ панель")}
                  </a>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-3 rounded-xl text-sm font-semibold text-pink-600 dark:text-pink-300 hover:bg-pink-50/80 dark:hover:bg-white/10 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

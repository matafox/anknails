import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Menu,
  X,
  Sun,
  Moon,
  Home,
  Sparkles,
  Gift,
  Star,
  HelpCircle,
  User,
  Globe,
} from "lucide-react";

export default function Header({ onMenuToggle }) {
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 🌓 Тема
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  const toggleMenu = () => {
    const newState = !menuOpen;
    setMenuOpen(newState);
    onMenuToggle?.(newState);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
    onMenuToggle?.(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAboutPage =
    typeof window !== "undefined" && window.location.hostname.includes("about.");
  if (isAboutPage) return null;

  const menuItems =
    i18n.language === "ru"
      ? [
          { icon: Home, label: "Главная", id: "home" },
          { icon: Sparkles, label: "Модули", id: "modules" },
          { icon: Star, label: "Для кого курс", id: "forwhom" },
          { icon: Gift, label: "Тарифы", id: "tariffs" },
          { icon: HelpCircle, label: "FAQ", id: "faq" },
        ]
      : [
          { icon: Home, label: "Головна", id: "home" },
          { icon: Sparkles, label: "Модулі", id: "modules" },
          { icon: Star, label: "Для кого курс", id: "forwhom" },
          { icon: Gift, label: "Тарифи", id: "tariffs" },
          { icon: HelpCircle, label: "FAQ", id: "faq" },
        ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-700 ${
        scrolled
          ? "backdrop-blur-xl bg-white/80 dark:bg-black/30 shadow-[0_0_25px_rgba(255,0,128,0.15)] border-b border-pink-400/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* 🩷 Логотип */}
        <span
          className={`text-2xl sm:text-3xl font-bold tracking-wide transition-all ${
            scrolled
              ? "text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-400"
              : darkMode
              ? "text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
              : "text-black"
          }`}
        >
          ANK Studio
        </span>

        {/* 🍔 Меню */}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-xl bg-white/40 dark:bg-white/10 border border-white/30 backdrop-blur-md hover:scale-105 transition-all"
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-pink-500" />
          ) : (
            <Menu className="w-6 h-6 text-pink-400" />
          )}
        </button>
      </div>

      {/* 🌸 Повноекранне меню */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center animate-fade-in"
          style={{
            height: "100vh",
            width: "100vw",
            backdropFilter: "blur(80px) saturate(250%) brightness(1.1)",
            WebkitBackdropFilter: "blur(80px) saturate(250%) brightness(1.1)",
            background: darkMode
              ? "rgba(10, 0, 20, 0.88)"
              : "rgba(255, 255, 255, 0.85)",
          }}
        >
          <div
            className="w-full max-w-md bg-white/20 dark:bg-[#1a0a1f]/70 backdrop-blur-3xl
            border border-pink-500/20 shadow-[0_0_60px_rgba(255,0,128,0.3)] 
            rounded-3xl p-10 flex flex-col items-center text-center space-y-6"
          >
            {menuItems.map(({ icon: Icon, label, id }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="flex items-center justify-center gap-3 w-full py-4 text-lg font-semibold
                  text-fuchsia-100 bg-gradient-to-r from-[#2a0f3a]/50 to-[#3b174c]/40 
                  hover:from-pink-700/40 hover:to-rose-600/40 border border-fuchsia-500/20 rounded-2xl
                  transition-all duration-300 hover:scale-[1.03] hover:border-fuchsia-400/40"
              >
                <Icon className="w-5 h-5 text-pink-400" />
                {label}
              </button>
            ))}

            {/* 🔗 Про мене */}
            <a
              href="https://about.ankstudio.online"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 mt-3 text-lg font-semibold rounded-2xl
                bg-gradient-to-r from-pink-500 to-rose-500 text-white 
                shadow-[0_0_25px_rgba(255,0,128,0.5)] hover:scale-[1.03] transition-all duration-300"
            >
              <div className="flex justify-center items-center gap-2">
                <User className="w-5 h-5" />
                {i18n.language === "ru" ? "Обо мне" : "Про мене"}
              </div>
            </a>

            {/* ⚙️ Тема + Мова */}
            <div className="mt-6 flex flex-col items-center gap-3 text-fuchsia-100">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 hover:text-white transition"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span className="text-sm font-medium">
                  {darkMode
                    ? i18n.language === "ru"
                      ? "Светлая тема"
                      : "Світла тема"
                    : i18n.language === "ru"
                    ? "Тёмная тема"
                    : "Темна тема"}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {["ru", "uk"].map((lng) => (
                  <button
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    className={`px-3 py-1 text-sm rounded-md transition-all font-medium ${
                      i18n.language === lng
                        ? "bg-pink-500 text-white shadow-[0_0_10px_rgba(255,0,128,0.4)]"
                        : "bg-white/10 text-fuchsia-200 hover:bg-pink-500/30"
                    }`}
                  >
                    {lng.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out both;
        }
      `}</style>
    </header>
  );
}

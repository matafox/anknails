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

export default function Header() {
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // 🌓 Ініціалізація теми
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

  // 🌍 Мова
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  // 💫 Прозорий до скролу
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 🧠 Вимикаємо хедер на сторінці “About”
  const isAboutPage =
    typeof window !== "undefined" && window.location.hostname.includes("about.");
  if (isAboutPage) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-700 ${
        scrolled
          ? "backdrop-blur-xl bg-white/70 dark:bg-black/30 shadow-[0_0_25px_rgba(255,0,128,0.15)] border-b border-pink-400/10"
          : "bg-transparent backdrop-blur-0 border-transparent"
      }`}
    >
      {/* Контейнер */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* 🌸 Логотип */}
        <span
          className={`text-2xl sm:text-3xl font-bold tracking-wide transition-all ${
            scrolled
              ? "text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-400"
              : "text-white dark:text-fuchsia-100 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
          }`}
        >
          ANK Studio
        </span>

        {/* 🍔 Меню-кнопка */}
        <button
          onClick={toggleMenu}
          className={`p-2 rounded-xl transition-all backdrop-blur-md ${
            scrolled
              ? "bg-white/70 dark:bg-white/10 border border-pink-400/20 shadow-md"
              : "bg-white/20 dark:bg-white/10 border border-white/30"
          } hover:scale-105`}
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-pink-500" />
          ) : (
            <Menu className="w-6 h-6 text-pink-400" />
          )}
        </button>
      </div>

      {/* 🔮 Повноекранне меню */}
      {menuOpen && (
        <>
          {/* затемнення */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-gradient-to-br from-[#0b0411]/90 via-[#150825]/90 to-[#0b0411]/90 backdrop-blur-sm transition-opacity duration-500 z-40"
          ></div>

          {/* панель */}
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            <div className="space-y-6 sm:space-y-8">
              {[
                { icon: Home, label: "Головна", id: "home" },
                { icon: Sparkles, label: "Модулі", id: "modules" },
                { icon: Star, label: "Для кого курс", id: "forwhom" },
                { icon: Gift, label: "Тарифи", id: "tariffs" },
                { icon: HelpCircle, label: "FAQ", id: "faq" },
              ].map(({ icon: Icon, label, id }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="flex items-center justify-center gap-3 text-2xl sm:text-3xl font-semibold text-fuchsia-200 hover:text-white transition-all"
                >
                  <Icon className="w-6 h-6 text-fuchsia-400" />
                  {label}
                </button>
              ))}

              {/* 📖 Про мене */}
              <a
                href="https://about.ankstudio.online"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-[0_0_20px_rgba(255,0,128,0.4)] hover:scale-105 transition-all"
              >
                <User className="w-5 h-5" />
                Про мене
              </a>
            </div>

            {/* низ меню */}
            <div className="mt-12 space-y-4 flex flex-col items-center text-fuchsia-300">
              {/* Тема */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 hover:text-white transition"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {darkMode ? "Світла тема" : "Темна тема"}
                </span>
              </button>

              {/* Мова */}
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
        </>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out both;
        }
      `}</style>
    </header>
  );
}

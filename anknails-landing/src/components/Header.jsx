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

  // 🧠 Перевіряємо, чи це сторінка About
  const isAboutPage =
    typeof window !== "undefined" && window.location.hostname.includes("about.");

  if (isAboutPage) return null; // ❌ На сторінці About не рендеримо меню взагалі

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-between items-center 
      bg-[#1b0f25]/95 backdrop-blur-lg border-b border-fuchsia-500/10 
      shadow-[0_0_25px_rgba(217,70,239,0.15)]"
    >
      {/* 🔮 Тільки текстовий логотип */}
      <span className="text-lg font-bold text-fuchsia-300 tracking-wide select-none">
        ANK Studio
      </span>

      {/* 🍔 Кнопка меню */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-xl bg-[#2a163a] border border-fuchsia-400/30 
                   hover:border-fuchsia-400/50 transition-all 
                   shadow-[0_0_10px_rgba(217,70,239,0.3)]"
      >
        {menuOpen ? (
          <X className="w-6 h-6 text-fuchsia-300" />
        ) : (
          <Menu className="w-6 h-6 text-fuchsia-300" />
        )}
      </button>

      {/* 💫 Меню */}
      {menuOpen && (
        <>
          {/* 🩶 BACKDROP */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-gradient-to-br from-[#0b0411]/90 via-[#150825]/90 to-[#0b0411]/90 
                       backdrop-blur-sm transition-opacity duration-500 z-40"
          />

          {/* 🟣 ПАНЕЛЬ */}
          <div
            className="fixed right-0 top-0 bottom-0 w-[280px] sm:w-[320px] bg-gradient-to-b 
                       from-[#1b0f2a] to-[#0d0614] z-50 border-l border-fuchsia-500/20 
                       shadow-[0_0_30px_rgba(217,70,239,0.3)] p-6 flex flex-col justify-between 
                       animate-slide-left"
          >
            {/* 🔹 Верх */}
            <div>
              <nav className="flex flex-col gap-3 mt-4">
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
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl 
                               bg-[#251034] hover:bg-fuchsia-600/20 transition-all 
                               border border-fuchsia-800/40 hover:border-fuchsia-500/50 
                               shadow-[inset_0_0_8px_rgba(217,70,239,0.25)] group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-fuchsia-400 group-hover:text-fuchsia-300" />
                      <span className="text-sm text-gray-200 font-medium group-hover:text-white">
                        {label}
                      </span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-fuchsia-500/40 group-hover:bg-fuchsia-400" />
                  </button>
                ))}
              </nav>

              {/* 📖 Про мене */}
              <a
                href="https://about.ankstudio.online"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-between px-4 py-2.5 rounded-xl 
                           bg-gradient-to-r from-fuchsia-700/50 to-pink-600/40 border border-fuchsia-500/40 
                           hover:border-fuchsia-400 text-white transition-all 
                           shadow-[0_0_15px_rgba(217,70,239,0.3)]"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-fuchsia-300" />
                  <span className="text-sm font-medium">Про мене</span>
                </div>
                <span className="text-xs text-fuchsia-300">→</span>
              </a>
            </div>

            {/* 🌙 Низ меню */}
            <div className="flex flex-col gap-4 pt-6 border-t border-fuchsia-500/20">
              {/* 🌓 Тема */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-fuchsia-300 hover:text-fuchsia-100 transition"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span className="text-sm font-medium">
                  {darkMode ? "Світла тема" : "Темна тема"}
                </span>
              </button>

              {/* 🌍 Мова */}
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-fuchsia-300" />
                {["ru", "uk"].map((lng) => (
                  <button
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    className={`px-3 py-1 text-sm rounded-md transition-all font-medium ${
                      i18n.language === lng
                        ? "bg-fuchsia-600/60 text-white shadow-[0_0_10px_rgba(217,70,239,0.4)]"
                        : "bg-[#1f102b] text-fuchsia-200 hover:bg-fuchsia-600/30"
                    }`}
                  >
                    {lng.toUpperCase()}
                  </button>
                ))}
              </div>

              <p className="text-xs text-fuchsia-500/60 mt-3">v1.0</p>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slide-left {
          from { transform: translateX(100%); opacity: 0.3; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-left {
          animation: slide-left 0.4s ease forwards;
        }
      `}</style>
    </header>
  );
}

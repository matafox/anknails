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

  // 🔗 Перехід на сторінку "Про мене"
  const goToAbout = () => {
    const lang = localStorage.getItem("lang") || i18n.language || "ru";
    window.location.href = `https://about.ankstudio.online?lang=${lang}`;
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-between items-center 
      bg-[#1b0f25]/90 backdrop-blur-lg border-b border-fuchsia-500/10 shadow-[0_0_25px_rgba(217,70,239,0.15)]">
      
      {/* 🔮 Логотип */}
      <div className="flex items-center gap-2 select-none">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-700 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(217,70,239,0.6)]">
          A
        </div>
        <span className="text-lg font-semibold text-fuchsia-300 tracking-wide">
          ANK Studio
        </span>
      </div>

      {/* 🍔 Кнопка меню */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-xl bg-[#2a163a]/60 border border-fuchsia-400/20 hover:border-fuchsia-400/40 transition-all"
      >
        {menuOpen ? (
          <X className="w-6 h-6 text-fuchsia-300" />
        ) : (
          <Menu className="w-6 h-6 text-fuchsia-300" />
        )}
      </button>

      {/* 💫 Повноекранне меню */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-40 flex justify-end">
          <div className="w-[270px] sm:w-[320px] h-full bg-[#140a1e]/95 border-l border-fuchsia-500/20 
            shadow-[0_0_30px_rgba(217,70,239,0.15)] flex flex-col justify-between p-6 animate-slide-left">
            
            {/* 🔹 Верх */}
            <div>
              {/* 👤 Профіль */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(217,70,239,0.5)]">
                  P
                </div>
                <div>
                  <p className="text-white font-semibold">Paul</p>
                  <p className="text-sm text-fuchsia-400/70">ID 335297143</p>
                </div>
              </div>

              {/* 📋 Основні кнопки */}
              <nav className="flex flex-col gap-3">
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
                    className="flex items-center justify-between px-3 py-2 rounded-xl 
                               bg-[#1e0f2a]/70 hover:bg-fuchsia-600/20 transition-all border border-transparent 
                               hover:border-fuchsia-400/20 shadow-[inset_0_0_10px_rgba(217,70,239,0.15)]"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-fuchsia-400" />
                      <span className="text-sm text-gray-200 font-medium">{label}</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-fuchsia-400/40" />
                  </button>
                ))}
              </nav>

              {/* 📖 Про мене */}
              <button
                onClick={goToAbout}
                className="mt-6 flex items-center justify-between px-3 py-2 rounded-xl 
                           bg-gradient-to-r from-fuchsia-600/40 to-pink-500/30 border border-fuchsia-400/20 
                           hover:border-fuchsia-400/40 text-white transition-all"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-fuchsia-300" />
                  <span className="text-sm font-medium">Про мене</span>
                </div>
                <span className="text-xs text-fuchsia-400/80">→</span>
              </button>
            </div>

            {/* 🌙 Низ меню */}
            <div className="flex flex-col gap-4 pt-6 border-t border-fuchsia-500/10">
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
        </div>
      )}

      <style>{`
        @keyframes slide-left {
          from { transform: translateX(100%); opacity: 0.4; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-left {
          animation: slide-left 0.4s ease forwards;
        }
      `}</style>
    </header>
  );
}

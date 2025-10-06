iimport { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X } from "lucide-react";

export default function Header() {
  const { i18n } = useTranslation();
  const [fade, setFade] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const changeLanguage = (lng) => {
    if (lng === i18n.language) return;
    setFade(true);
    setTimeout(() => {
      i18n.changeLanguage(lng);
      localStorage.setItem("lang", lng);
      setFade(false);
    }, 200);
  };

  // 🔄 синхронізація між вкладками
  useEffect(() => {
    const syncLang = (e) => {
      if (e.key === "lang" && e.newValue && e.newValue !== i18n.language) {
        i18n.changeLanguage(e.newValue);
      }
    };
    window.addEventListener("storage", syncLang);
    return () => window.removeEventListener("storage", syncLang);
  }, [i18n]);

  const isAbout =
    typeof window !== "undefined" &&
    window.location.hostname.startsWith("about.");

  const goToCourse = () => {
    const lang = localStorage.getItem("lang") || i18n.language || "ru";
    window.location.href = `https://ankstudio.online?lang=${lang}`;
  };

  const goToAbout = () => {
    const lang = localStorage.getItem("lang") || i18n.language || "ru";
    window.location.href = `https://about.ankstudio.online?lang=${lang}`;
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMenu();
    }
  };

  const openMenu = () => {
    setMenuOpen(true);
    setTimeout(() => setMenuVisible(true), 30);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setTimeout(() => setMenuOpen(false), 400);
  };

  if (isAbout) {
    return (
      <header className="absolute top-6 right-6 z-20 flex flex-wrap gap-2 justify-end items-center">
        <div
          className={`flex gap-2 items-center transition-opacity duration-300 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        >
          <button
            onClick={goToCourse}
            className="px-3 py-1 text-sm rounded-md border border-pink-200 dark:border-neutral-700 
                       bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium
                       shadow-md hover:scale-105 transition-all duration-300"
          >
            {i18n.language === "ru" ? "Курс" : "Курс"}
          </button>

          {["ru", "uk"].map((lng) => (
            <button
              key={lng}
              onClick={() => changeLanguage(lng)}
              className={`px-3 py-1 text-sm rounded-md backdrop-blur-sm border transition-all ${
                i18n.language === lng
                  ? "bg-pink-500 text-white border-transparent shadow-lg"
                  : "bg-white/50 dark:bg-white/10 text-gray-600 dark:text-gray-300 border-pink-100 dark:border-neutral-700 hover:bg-pink-100/80"
              }`}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-6 left-6 right-6 z-40 flex justify-between items-center">
      {/* Кнопка меню */}
      <button
        onClick={() => (menuOpen ? closeMenu() : openMenu())}
        className="p-3 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md border border-pink-200 dark:border-neutral-700 shadow-md hover:scale-105 transition-transform duration-500"
        aria-label="Меню"
      >
        <div
          className={`transition-transform duration-500 ${
            menuOpen ? "rotate-45 text-rose-500" : "rotate-0 text-pink-600"
          }`}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </div>
      </button>

      {/* Правий блок: кнопки */}
      <div
        className={`flex gap-2 items-center transition-opacity duration-300 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        <button
          onClick={goToAbout}
          className="px-3 py-1 text-sm rounded-md border border-pink-200 dark:border-neutral-700 
                     bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium
                     shadow-md hover:scale-105 transition-all duration-300"
        >
          {i18n.language === "ru" ? "Обо мне" : "Про мене"}
        </button>

        {["ru", "uk"].map((lng) => (
          <button
            key={lng}
            onClick={() => changeLanguage(lng)}
            className={`px-3 py-1 text-sm rounded-md backdrop-blur-sm border transition-all ${
              i18n.language === lng
                ? "bg-pink-500 text-white border-transparent shadow-lg"
                : "bg-white/50 dark:bg-white/10 text-gray-600 dark:text-gray-300 border-pink-100 dark:border-neutral-700 hover:bg-pink-100/80"
            }`}
          >
            {lng.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Плавне меню */}
      {menuOpen && (
        <div
          className={`fixed top-0 left-0 w-full h-full z-30 bg-gradient-to-b from-pink-100 via-white to-rose-100 dark:from-[#1a1a1a] dark:via-[#232323] dark:to-[#1a1a1a]
          backdrop-blur-2xl flex flex-col items-center justify-center text-3xl font-semibold text-gray-800 dark:text-gray-100
          transition-all duration-500 ${
            menuVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10 pointer-events-none"
          }`}
        >
          {[
            { id: "modules", label: i18n.language === "ru" ? "Модули" : "Модулі" },
            { id: "works", label: i18n.language === "ru" ? "Работы" : "Роботи" },
            { id: "forwhom", label: i18n.language === "ru" ? "Для кого" : "Для кого" },
            { id: "faq", label: i18n.language === "ru" ? "Вопросы" : "Питання" },
            { id: "tariffs", label: i18n.language === "ru" ? "Тарифы" : "Тарифи" },
          ].map((item, i) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`hover:text-pink-600 dark:hover:text-rose-400 transition-colors duration-300 ${
                menuVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        header button {
          transition: all 0.25s ease;
        }
        header button:active {
          transform: scale(0.95);
        }
      `}</style>
    </header>
  );
}

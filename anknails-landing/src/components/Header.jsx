import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X } from "lucide-react";

export default function Header() {
  const { i18n } = useTranslation();
  const [fade, setFade] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // 🧭 переходи між сторінками (в тій самій вкладці)
  const goToCourse = () => {
    const lang = localStorage.getItem("lang") || i18n.language || "ru";
    window.location.href = `https://ankstudio.online?lang=${lang}`;
  };

  const goToAbout = () => {
    const lang = localStorage.getItem("lang") || i18n.language || "ru";
    window.location.href = `https://about.ankstudio.online?lang=${lang}`;
  };

  // 📜 плавна прокрутка до секцій
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
    }
  };

  // показуємо меню тільки на головному сайті
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

  // 🩷 --- головна сторінка з меню ---
  return (
    <header className="fixed top-6 left-6 right-6 z-30 flex justify-between items-center">
      {/* Кнопка меню (плюс ↔ хрестик) */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-3 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md border border-pink-200 dark:border-neutral-700 shadow-md hover:scale-105 transition-transform duration-300"
        aria-label="Відкрити меню"
      >
        <div
          className={`transition-transform duration-500 ${
            menuOpen ? "rotate-45 text-rose-500" : "rotate-0 text-pink-600"
          }`}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </div>
      </button>

      {/* блок праворуч (мови + про мене) */}
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

      {/* Меню зверху */}
      {menuOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl flex flex-col items-center justify-center gap-8 text-2xl font-semibold text-gray-800 dark:text-gray-100 transition-opacity duration-500">
          {[
            { id: "modules", label: i18n.language === "ru" ? "Модули" : "Модулі" },
            { id: "works", label: i18n.language === "ru" ? "Работы" : "Роботи" },
            { id: "forwhom", label: i18n.language === "ru" ? "Для кого" : "Для кого" },
            { id: "faq", label: i18n.language === "ru" ? "Вопросы" : "Питання" },
            { id: "tariffs", label: i18n.language === "ru" ? "Тарифы" : "Тарифи" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="hover:text-pink-500 transition-colors duration-300"
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

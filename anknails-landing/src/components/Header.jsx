import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X } from "lucide-react";

export default function Header() {
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fade, setFade] = useState(false);

  const changeLanguage = (lng) => {
    if (lng === i18n.language) return;
    setFade(true);
    setTimeout(() => {
      i18n.changeLanguage(lng);
      localStorage.setItem("lang", lng);
      setFade(false);
    }, 200);
  };

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
      setMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
      {/* --- Ліва частина: кнопка меню --- */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2 rounded-full border border-pink-200 dark:border-neutral-700 
                   bg-white/40 dark:bg-neutral-800/60 backdrop-blur-md 
                   shadow-md hover:scale-110 transition-transform duration-300"
        aria-label="Меню"
      >
        {menuOpen ? (
          <X className="w-6 h-6 text-pink-600 dark:text-pink-300 transition-transform duration-300 rotate-90" />
        ) : (
          <Plus className="w-6 h-6 text-pink-600 dark:text-pink-300 transition-transform duration-300 rotate-0" />
        )}
      </button>

      {/* --- Права частина: мови + кнопка "Про мене" --- */}
      <div
        className={`flex gap-2 items-center transition-opacity duration-300 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* кнопка "Курс" або "Обо мне" */}
        {isAbout ? (
          <button
            onClick={goToCourse}
            className="px-3 py-1 text-sm rounded-md border border-pink-200 dark:border-neutral-700 
                       bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium
                       shadow-md hover:scale-105 transition-all duration-300"
          >
            {i18n.language === "ru" ? "Курс" : "Курс"}
          </button>
        ) : (
          <button
            onClick={goToAbout}
            className="px-3 py-1 text-sm rounded-md border border-pink-200 dark:border-neutral-700 
                       bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium
                       shadow-md hover:scale-105 transition-all duration-300"
          >
            {i18n.language === "ru" ? "Обо мне" : "Про мене"}
          </button>
        )}

        {/* перемикач мов */}
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

      {/* --- Меню (повноекранне скляне) --- */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-2xl 
                     flex flex-col items-center justify-center z-40 
                     text-gray-900 dark:text-white space-y-6 text-2xl font-medium
                     transition-all duration-300"
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-pink-500 text-white shadow-lg hover:scale-110 transition-transform duration-300"
          >
            <X className="w-6 h-6" />
          </button>

          <button onClick={() => scrollToSection("modules")}>
            {i18n.language === "ru" ? "Модули" : "Модулі"}
          </button>
          <button onClick={() => scrollToSection("works")}>
            {i18n.language === "ru" ? "Работы учениц" : "Роботи учениць"}
          </button>
          <button onClick={() => scrollToSection("forwhom")}>
            {i18n.language === "ru" ? "Кому подходит" : "Для кого курс"}
          </button>
          <button onClick={() => scrollToSection("tariffs")}>
            {i18n.language === "ru" ? "Тарифы" : "Тарифи"}
          </button>
          <button onClick={() => scrollToSection("faq")}>
            {i18n.language === "ru" ? "Вопросы" : "Питання"}
          </button>
        </div>
      )}
    </header>
  );
}

import { useEffect, useState } from "react";
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
        className="p-3 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md 
                   border border-pink-200 dark:border-neutral-700 shadow-md 
                   hover:scale-105 transition-transform duration-500"
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

      {/* Мови + “Обо мне” */}
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

      {/* Скляне меню */}
      {menuOpen && (
        <div
          className={`fixed inset-0 z-30 flex flex-col items-center justify-center
          transition-all duration-500 ease-out
          ${
            menuVisible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          {/* Скляний бек */}
          <div className="absolute inset-0 bg-white/15 dark:bg-black/25 backdrop-blur-3xl border-t border-white/20 shadow-2xl" />

          {/* Напівпрозорі сяючі плями */}
          <div className="absolute top-[-100px] left-[50px] w-[400px] h-[400px] bg-pink-300/30 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-150px] right-[50px] w-[400px] h-[400px] bg-rose-400/30 blur-[160px] rounded-full" />

          {/* Меню */}
          <nav className="relative z-40 flex flex-col items-center gap-6 text-3xl font-semibold text-gray-800 dark:text-gray-100">
            {[
              { id: "modules", label: i18n.language === "ru" ? "Модули" : "Модулі" },
              { id: "works", label: i18n.language === "ru" ? "Работы" : "Роботи" },
              { id: "forwhom", label: i18n.language === "ru" ? "Для кого" : "Для кого" },
              { id: "tariffs", label: i18n.language === "ru" ? "Тарифы" : "Тарифи" },
              { id: "faq", label: i18n.language === "ru" ? "Вопросы" : "Питання" },
            ].map((item, i) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative text-white/90 hover:text-white transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

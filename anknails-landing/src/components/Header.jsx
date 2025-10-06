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

  // 🔒 меню не показуємо на about-сайті
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
    <header className="fixed top-6 right-6 z-50 flex items-center gap-3">
      {/* Кнопки мов і "Обо мне" */}
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

      {/* Кнопка меню */}
      <button
        onClick={() => (menuOpen ? closeMenu() : openMenu())}
        className="p-3 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md 
                   border border-pink-200 dark:border-neutral-700 shadow-md 
                   hover:scale-110 active:scale-95 transition-transform duration-500"
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

      {/* Меню (glass background) */}
      {menuOpen && (
        <div
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center 
          transition-all duration-500 ease-out 
          ${menuVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
        >
          {/* Скляний фон */}
          <div
            className="absolute inset-0 bg-white/20 dark:bg-black/25 backdrop-blur-3xl 
                       border-t border-white/10 shadow-inner"
          ></div>

          {/* Світлові плями */}
          <div className="absolute top-[-100px] left-[50px] w-[400px] h-[400px] bg-pink-300/25 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-150px] right-[50px] w-[400px] h-[400px] bg-fuchsia-400/30 blur-[160px] rounded-full"></div>

          {/* Кнопка закриття у меню */}
          <button
            onClick={closeMenu}
            className="absolute top-8 right-8 p-3 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md 
                       border border-pink-200 dark:border-neutral-700 shadow-md 
                       hover:scale-110 active:scale-95 transition-transform duration-500 z-50"
          >
            <X className="w-6 h-6 text-pink-600 dark:text-pink-300" />
          </button>

          {/* Посилання */}
          <nav className="relative z-50 flex flex-col items-center gap-6 text-3xl font-semibold text-gray-900 dark:text-white">
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
                className="text-white/90 hover:text-white bg-pink-500/10 hover:bg-pink-500/20 
                           px-6 py-3 rounded-xl backdrop-blur-sm border border-white/20
                           shadow-lg transition-all duration-300"
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

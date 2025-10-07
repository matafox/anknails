import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { i18n } = useTranslation();
  const [fade, setFade] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMenuButton, setShowMenuButton] = useState(true);
  const [isMainDomain, setIsMainDomain] = useState(true); // 👈 перевіряємо домен

  // ✅ визначаємо чи це основний домен
  useEffect(() => {
    const host = window.location.hostname;
    setIsMainDomain(!host.startsWith("about.") && !host.includes("course."));
  }, []);

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

  // 🌸 тільки на головному домені: ховаємо кнопку при скролі
  useEffect(() => {
    if (!isMainDomain) return; // ❌ не чіпати, якщо субдомен

    let lastScroll = 0;
    const handleScroll = () => {
      const current = window.scrollY;

      if (current > 100 && current > lastScroll) {
        setShowMenuButton(false);
      } else if (current <= 10) {
        setShowMenuButton(true);
      }

      lastScroll = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMainDomain]);

  // 🚫 блокуємо прокрутку при відкритому меню
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const goToAbout = () => {
    const lang = localStorage.getItem("lang") || i18n.language || "ru";
    window.location.href = `https://about.ankstudio.online?lang=${lang}`;
  };

  const goToCourse = () => {
    const lang = localStorage.getItem("lang") || i18n.language || "ru";
    window.location.href = `https://ankstudio.online?lang=${lang}`;
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4
        backdrop-blur-lg bg-white/70 dark:bg-black/40 shadow-md transition-all duration-300`}
    >
      {/* кнопка меню */}
      <button
        onClick={toggleMenu}
        className={`p-2 rounded-md bg-white/40 dark:bg-white/10 border border-white/30 backdrop-blur-lg
          hover:bg-white/60 dark:hover:bg-white/20 transition-all shadow-md duration-500 transform
          ${
            isMainDomain
              ? showMenuButton
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-3 pointer-events-none"
              : "opacity-100 translate-y-0"
          }`}
        aria-label="Меню"
      >
        {menuOpen ? (
          <X className="w-6 h-6 text-pink-600 dark:text-pink-400" />
        ) : (
          <Menu className="w-6 h-6 text-pink-600 dark:text-pink-400" />
        )}
      </button>

      {/* кнопки мов і “Обо мне” */}
      <div
        className={`flex gap-2 items-center flex-wrap justify-end transition-opacity duration-300 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        <button
          onClick={goToAbout}
          className="px-3 py-1 text-sm rounded-md border border-pink-200 dark:border-neutral-700 
                     bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium
                     shadow-md hover:scale-105 transition-all duration-300"
        >
          {i18n.language === "ru"
            ? "Обо мне"
            : i18n.language === "pl"
            ? "O mnie"
            : i18n.language === "en"
            ? "About me"
            : "Про мене"}
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

      {/* фулскрін меню */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-white/50 dark:bg-black/60 backdrop-blur-3xl z-[9999] flex flex-col items-center justify-center 
          space-y-6 sm:space-y-8 text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white transition-all duration-300"
        >
          <button onClick={() => scrollToSection("modules")}>
            {i18n.language === "ru" ? "Модули" : "Модулі"}
          </button>
          <button onClick={() => scrollToSection("forwhom")}>
            {i18n.language === "ru" ? "Для кого курс" : "Для кого курс"}
          </button>
          <button onClick={() => scrollToSection("coursestart")}>
            {i18n.language === "ru" ? "Старт курса" : "Старт курсу"}
          </button>
          <button onClick={() => scrollToSection("works")}>
            {i18n.language === "ru" ? "Работы учениц" : "Роботи учениць"}
          </button>
          <button onClick={() => scrollToSection("tariffs")}>
            {i18n.language === "ru" ? "Тарифы" : "Тарифи"}
          </button>
          <button onClick={() => scrollToSection("faq")}>
            {i18n.language === "ru" ? "FAQ" : "Питання"}
          </button>
        </div>
      )}
    </header>
  );
}

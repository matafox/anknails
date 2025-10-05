import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { i18n } = useTranslation();
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

  // визначаємо, де ми — на сабдомені "about" чи ні
  const isAbout = typeof window !== "undefined" && window.location.hostname.startsWith("about.");

  return (
    <header className="absolute top-6 right-6 z-20 flex flex-wrap gap-2 justify-end items-center">
      <div
        className={`flex gap-2 items-center transition-opacity duration-300 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* якщо ми на about → показати кнопку "Курс", якщо ні → "Обо мне" */}
        {isAbout ? (
          <button
            onClick={() => (window.location.href = "https://ankstudio.online")}
            className="px-3 py-1 text-sm rounded-md border border-pink-200 dark:border-neutral-700 
                       bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium
                       shadow-md hover:scale-105 transition-all duration-300"
          >
            {i18n.language === "ru" ? "Курс" : "Курс"}
          </button>
        ) : (
          <button
            onClick={() => window.open("https://about.ankstudio.online", "_blank")}
            className="px-3 py-1 text-sm rounded-md border border-pink-200 dark:border-neutral-700 
                       bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium
                       shadow-md hover:scale-105 transition-all duration-300"
          >
            {i18n.language === "ru" ? "Обо мне" : "Про мене"}
          </button>
        )}

        {/* перемикачі мов */}
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

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { i18n, t } = useTranslation();
  const [fade, setFade] = useState(false);
  const [isAboutPage, setIsAboutPage] = useState(false);

  useEffect(() => {
    // перевіряємо, чи це сабдомен about
    setIsAboutPage(window.location.hostname.startsWith("about."));
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

  // 🔄 синхронізація мови між вкладками
  useEffect(() => {
    const syncLang = (e) => {
      if (e.key === "lang" && e.newValue && e.newValue !== i18n.language) {
        i18n.changeLanguage(e.newValue);
      }
    };
    window.addEventListener("storage", syncLang);
    return () => window.removeEventListener("storage", syncLang);
  }, [i18n]);

  // переходи між сторінками
  const goToAbout = () => {
    const lang = i18n.language || "ru";
    window.location.href = `https://about.ankstudio.online?lang=${lang}`;
  };

  const goToMain = () => {
    const lang = i18n.language || "ru";
    window.location.href = `https://ankstudio.online?lang=${lang}`;
  };

  return (
    <header className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-wrap gap-2 justify-end items-center">
      {/* Кнопка "Про мене / Курс" */}
      <button
        onClick={isAboutPage ? goToMain : goToAbout}
        className="px-3 py-1 text-sm rounded-md border border-pink-200 dark:border-neutral-700 
                   bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-md 
                   hover:scale-105 hover:shadow-pink-400/40 transition-all duration-300 animate-glow"
      >
        {isAboutPage ? t("course_button", "Курс") : t("about_button", "Про мене")}
      </button>

      {/* Перемикачі мов */}
      <div
        className={`flex gap-2 items-center transition-opacity duration-300 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
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
          transform: scale(0.93);
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(236,72,153,0.4); }
          50% { box-shadow: 0 0 20px rgba(244,63,94,0.6); }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
}

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
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

  return (
    <header className="absolute top-6 right-6 z-20 flex gap-2">
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

      {/* кнопка "Про мене" */}
      <button
        onClick={() => window.open("https://about.ankstudio.online", "_blank")}
        className="ml-2 px-3 py-1 text-sm rounded-md border border-pink-200 dark:border-neutral-700 
                   bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium
                   shadow-md hover:scale-105 transition-all duration-300"
      >
        {t("about_button", "Про мене")}
      </button>
    </header>
  );
}

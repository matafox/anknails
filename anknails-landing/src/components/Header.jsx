import { useTranslation } from "react-i18next";

export default function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("preferredLang", lng);

    // синхронізація між доменами
    const event = new CustomEvent("langChange", { detail: lng });
    window.dispatchEvent(event);
  };

  const isAboutPage = window.location.hostname.startsWith("about.");

  // якщо ми переходимо на інший домен — додаємо ?lang=ru або ?lang=uk
  const currentLang = i18n.language || localStorage.getItem("preferredLang") || "ru";
  const aboutUrl = `https://about.ankstudio.online/?lang=${currentLang}`;
  const mainUrl = `https://ankstudio.online/?lang=${currentLang}`;

  return (
    <header className="absolute top-6 right-6 z-20 flex flex-wrap justify-end gap-2 sm:gap-3">
      {/* Кнопка "Про мене" або "Назад" */}
      {!isAboutPage ? (
        <a
          href={aboutUrl}
          className="px-4 py-1.5 text-sm font-semibold rounded-md backdrop-blur-sm border border-pink-200/60 
                     bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md
                     hover:scale-105 hover:shadow-pink-400/40 transition-all duration-300"
        >
          {t("about_me", i18n.language === "ru" ? "Обо мне" : "Про мене")}
        </a>
      ) : (
        <button
          onClick={() => (window.location.href = mainUrl)}
          className="px-4 py-1.5 text-sm font-semibold rounded-md backdrop-blur-sm border border-pink-200/60 
                     bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md
                     hover:scale-105 hover:shadow-gray-400/40 transition-all duration-300"
        >
          {t("back_button", i18n.language === "ru" ? "Назад" : "Назад")}
        </button>
      )}

      {/* Кнопки мов */}
      {["ru", "uk"].map((lng) => (
        <button
          key={lng}
          onClick={() => changeLanguage(lng)}
          className={`px-3 py-1 text-sm rounded-md backdrop-blur-sm border transition-all duration-300 ${
            i18n.language === lng
              ? "bg-pink-500 text-white border-transparent shadow-lg scale-105"
              : "bg-white/50 dark:bg-white/10 text-gray-600 dark:text-gray-300 border-pink-100 dark:border-neutral-700 hover:bg-pink-100/80"
          }`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </header>
  );
}

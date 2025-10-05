import { useTranslation } from "react-i18next";

export default function Header() {
  const { i18n } = useTranslation();
  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <header className="absolute top-6 right-6 z-20 flex gap-2">
      {["uk", "ru"].map((lng) => (
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
    </header>
  );
}


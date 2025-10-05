import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function App() {
  const { t, i18n } = useTranslation();
  const [showMessage, setShowMessage] = useState(false);

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const handlePreorder = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2500);
  };

  const modules = t("modules", { returnObjects: true });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-pink-100 via-white to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 transition-all">
      {/* Header */}
      <div className="absolute top-5 right-5 flex gap-2">
        {["uk", "pl", "en", "ru"].map((lng) => (
          <button
            key={lng}
            onClick={() => changeLanguage(lng)}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-pink-500"
          >
            {lng.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-gray-900 dark:text-white tracking-tight">
        {t("title")}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-md">
        {t("subtitle")}
      </p>

      {/* Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 w-full max-w-3xl">
        {modules.map((m, i) => (
          <div
            key={i}
            className="p-6 bg-white/70 dark:bg-white/10 rounded-2xl shadow-lg backdrop-blur-sm hover:scale-105 transition-transform border border-pink-100 dark:border-neutral-700"
          >
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">{m}</h2>
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={handlePreorder}
        className="px-8 py-3 rounded-full bg-pink-500 text-white font-medium text-lg hover:bg-pink-600 active:scale-95 transition-all shadow-lg"
      >
        {t("preorder")}
      </button>

      {/* Toast */}
      {showMessage && (
        <div className="fixed bottom-8 bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in">
          {t("thanks")}
        </div>
      )}

      <style>
        {`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        `}
      </style>
    </div>
  );
}


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
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-gradient-to-b from-[#ffe6eb] via-[#fff] to-[#fff0f3] dark:from-[#1a1a1a] dark:via-[#232323] dark:to-[#1a1a1a] transition-all">
      {/* background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-pink-300/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-rose-400/20 rounded-full blur-[150px]" />
      </div>

      {/* language buttons */}
      <div className="absolute top-6 right-6 flex gap-2 z-10">
        {["uk", "pl", "en", "ru"].map((lng) => (
          <button
            key={lng}
            onClick={() => changeLanguage(lng)}
            className={`px-3 py-1 text-sm rounded-md backdrop-blur-sm border ${
              i18n.language === lng
                ? "bg-pink-500 text-white border-transparent shadow-lg"
                : "bg-white/50 dark:bg-white/10 text-gray-600 dark:text-gray-300 border-pink-100 dark:border-neutral-700 hover:bg-pink-100/80"
            }`}
          >
            {lng.toUpperCase()}
          </button>
        ))}
      </div>

      {/* content */}
      <main className="z-10 px-4 sm:px-6 max-w-3xl">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight drop-shadow-sm">
          ANKNAILS
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-10">
          {t("subtitle")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {modules.map((m, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/70 dark:bg-white/10 border border-pink-100 dark:border-neutral-700 backdrop-blur-sm p-6 shadow-md hover:shadow-pink-200 dark:hover:shadow-pink-900 transition-all transform hover:-translate-y-1"
            >
              <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                {m}
              </h2>
            </div>
          ))}
        </div>

        <button
          onClick={handlePreorder}
          className="relative px-10 py-4 rounded-full text-white font-medium text-lg bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg hover:shadow-pink-300 hover:scale-105 transition-transform"
        >
          {t("preorder")}
          <span className="absolute inset-0 rounded-full bg-pink-400 blur-md opacity-30"></span>
        </button>

        {showMessage && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in">
            {t("thanks")}
          </div>
        )}
      </main>

      <footer className="absolute bottom-5 text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} ANKNAILS — Beauty Academy
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>
    </div>
  );
}

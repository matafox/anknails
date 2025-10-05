import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function App() {
  const { t, i18n } = useTranslation();
  const [showMessage, setShowMessage] = useState(false);

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const handlePreorder = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2500);
  };

  const modules = t("modules", { returnObjects: true });

  useEffect(() => {
    document.title = "ANKNAILS — " + t("title");
  }, [i18n.language]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 via-rose-50 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 text-center relative overflow-hidden">
      {/* soft background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,182,193,0.25),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,105,180,0.15),transparent_70%)]"></div>

      {/* language buttons */}
      <div className="absolute top-6 right-6 flex gap-2 z-10">
        {["uk", "pl", "en", "ru"].map((lng) => (
          <button
            key={lng}
            onClick={() => changeLanguage(lng)}
            className={`px-2 py-1 text-sm rounded-md transition-all ${
              i18n.language === lng
                ? "bg-pink-500 text-white shadow-md"
                : "bg-white/60 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-white/20"
            }`}
          >
            {lng.toUpperCase()}
          </button>
        ))}
      </div>

      {/* hero text */}
      <div className="z-10 px-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-sm tracking-tight animate-fade-in">
          {t("title")}
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-xl mx-auto animate-fade-in-delay">
          {t("subtitle")}
        </p>

        {/* modules grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {modules.map((m, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/70 dark:bg-white/10 border border-pink-100 dark:border-white/10 backdrop-blur-md shadow-lg hover:shadow-pink-200 dark:hover:shadow-pink-900 hover:scale-105 transition-all"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {m}
              </h2>
            </div>
          ))}
        </div>

        {/* preorder button */}
        <button
          onClick={handlePreorder}
          className="relative px-10 py-4 text-lg font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          {t("preorder")}
          <span className="absolute inset-0 rounded-full bg-pink-400 blur-lg opacity-30"></span>
        </button>
      </div>

      {/* toast */}
      {showMessage && (
        <div className="fixed bottom-10 bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in z-20">
          {t("thanks")}
        </div>
      )}

      {/* footer */}
      <footer className="absolute bottom-4 text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} ANKNAILS — Beauty Academy
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.7s ease-out; }
        .animate-fade-in-delay { animation: fade-in 1s ease-out; animation-delay: 0.3s; animation-fill-mode: both; }
      `}</style>
    </div>
  );
}

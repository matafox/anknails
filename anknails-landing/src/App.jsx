import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function App() {
  const { t, i18n } = useTranslation();
  const [showToast, setShowToast] = useState(false);

  const modules = t("modules", { returnObjects: true });

  const handlePreorder = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#ffe6eb] via-[#fff8fa] to-[#fff] dark:from-[#141414] dark:via-[#1d1d1d] dark:to-[#141414] text-center transition-all duration-500">
      {/* glowing background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[450px] h-[450px] bg-rose-400/25 rounded-full blur-[150px]" />
      </div>

      {/* language switcher */}
      <div className="absolute top-6 right-6 flex gap-2 z-20">
        {["uk", "pl", "en", "ru"].map((lng) => (
          <button
            key={lng}
            onClick={() => i18n.changeLanguage(lng)}
            className={`px-3 py-1 text-sm rounded-md backdrop-blur-sm border transition-all ${
              i18n.language === lng
                ? "bg-pink-500 text-white border-transparent shadow-lg"
                : "bg-white/60 dark:bg-white/10 text-gray-700 dark:text-gray-300 border-pink-100 dark:border-neutral-700 hover:bg-pink-100/80"
            }`}
          >
            {lng.toUpperCase()}
          </button>
        ))}
      </div>

      {/* title */}
      <div className="z-10 max-w-3xl px-4">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-sm animate-fade-in">
          ANKNAILS
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 animate-fade-in-delay">
          {t("subtitle")}
        </p>
      </div>

      {/* modules */}
      <div className="z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-4xl px-6">
        {modules.map((m, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white/70 dark:bg-white/10 border border-pink-100 dark:border-neutral-700 backdrop-blur-md shadow-md hover:shadow-pink-200 dark:hover:shadow-pink-800 transition-all transform hover:-translate-y-1 p-6"
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
        className="relative px-10 py-4 rounded-full text-white font-medium text-lg bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg hover:shadow-pink-300 hover:scale-105 active:scale-95 transition-transform"
      >
        {t("preorder")}
        <span className="absolute inset-0 rounded-full bg-pink-400 blur-md opacity-30"></span>
      </button>

      {/* toast message */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in">
          {t("thanks")}
        </div>
      )}

      {/* footer */}
      <footer className="absolute bottom-5 text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} ANKNAILS — Beauty Academy
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out;
          animation-delay: 0.3s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}

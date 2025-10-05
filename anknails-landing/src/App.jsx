import Header from "./components/Header";
import Footer from "./components/Footer";
import MasterSection from "./components/MasterSection";
import ModulesList from "./components/ModulesList";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function App() {
  const { t } = useTranslation();
  const [toast, setToast] = useState(false);

  const handlePreorder = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center overflow-hidden bg-gradient-to-b from-[#ffe6eb] via-[#fff] to-[#fff5f7] dark:from-[#1a1a1a] dark:via-[#232323] dark:to-[#1a1a1a] text-center">
      <Header />

      <main className="flex-grow w-full flex flex-col items-center justify-center px-4 z-10">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-sm">
          {t("title")}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl">
          {t("subtitle")}
        </p>

        <MasterSection /> 
        <ModulesList />

        <button
          onClick={handlePreorder}
          className="mt-12 relative px-10 py-4 rounded-full text-white font-medium text-lg bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg hover:shadow-pink-300 hover:scale-105 transition-transform"
        >
          {t("preorder")}
          <span className="absolute inset-0 rounded-full bg-pink-400 blur-md opacity-30"></span>
        </button>

        {toast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in">
            {t("thanks")}
          </div>
        )}
      </main>

      <Footer />

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  );
}

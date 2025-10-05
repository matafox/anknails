import Header from "./components/Header";
import Footer from "./components/Footer";
import ModuleCard from "./components/ModuleCard";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function App() {
  const { t } = useTranslation();
  const modules = t("modules", { returnObjects: true });
  const [toast, setToast] = useState(false);

  const handlePreorder = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between text-center overflow-hidden bg-gradient-to-b from-[#ffe8ec] via-[#fffafc] to-[#fff] dark:from-[#1a1a1a] dark:via-[#232323] dark:to-[#1a1a1a]">
      {/* glowing background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-pink-300/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-rose-400/20 rounded-full blur-[150px]" />
      </div>

      {/* header */}
      <Header />

      {/* main content */}
      <main className="z-10 flex flex-col items-center justify-center flex-grow px-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight drop-shadow-sm">
          ANKNAILS — {t("title")}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl">
          {t("subtitle")}
        </p>

        {/* modules */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 w-full max-w-4xl">
          {modules.map((m, i) => (
            <ModuleCard key={i} title={m} />
          ))}
        </div>

        {/* preorder button */}
        <button
          onClick={handlePreorder}
          className="relative px-10 py-4 rounded-full text-white font-medium text-lg bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg hover:shadow-pink-300 hover:scale-105 transition-transform"
        >
          {t("preorder")}
          <span className="absolute inset-0 rounded-full bg-pink-400 blur-md opacity-30"></span>
        </button>

        {/* toast */}
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

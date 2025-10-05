import Header from "./components/Header";
import Footer from "./components/Footer";
import MasterSection from "./components/MasterSection";
import CourseIntro from "./components/CourseIntro";
import ModulesList from "./components/ModulesList";
import TariffsSection from "./components/TariffsSection";
import CourseStart from "./components/CourseStart";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function App() {
  const { t } = useTranslation();
  const [toast, setToast] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Трохи затримки перед показом для м’якої анімації
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handlePreorder = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center overflow-hidden bg-gradient-to-b from-[#ffe6eb] via-[#fff] to-[#fff5f7] dark:from-[#1a1a1a] dark:via-[#232323] dark:to-[#1a1a1a] text-center">
      <Header />

      <main
        className={`flex-grow w-full flex flex-col items-center justify-center px-4 z-10 pt-24 sm:pt-28 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* головний заголовок */}
        <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-sm animate-fade-up">
          {t("title")}
        </h1>

        {/* підзаголовок */}
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl animate-fade-up-delay">
          {t("subtitle")}
        </p>

        {/* секції */}
        <div className="space-y-20 w-full animate-sections">
          <MasterSection />
          <CourseIntro />
          <ModulesList />
          <TariffsSection />
          <CourseStart />
        </div>

        {/* кнопка */}
        <button
          onClick={handlePreorder}
          className="mt-12 relative px-10 py-4 rounded-full text-white font-medium text-lg bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg hover:shadow-pink-300 hover:scale-105 transition-transform duration-300"
        >
          {t("preorder")}
          <span className="absolute inset-0 rounded-full bg-pink-400 blur-md opacity-30"></span>
        </button>

        {/* тост */}
        {toast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in">
            {t("thanks")}
          </div>
        )}
      </main>

      <Footer />

      {/* анімації */}
      <style>{`
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.8s ease-out forwards;
        }
        .animate-fade-up-delay {
          animation: fade-up 1s ease-out 0.3s forwards;
        }
        .animate-sections > * {
          opacity: 0;
          transform: translateY(30px);
          animation: fade-up 0.9s ease-out forwards;
        }
        .animate-sections > *:nth-child(1) { animation-delay: 0.2s; }
        .animate-sections > *:nth-child(2) { animation-delay: 0.4s; }
        .animate-sections > *:nth-child(3) { animation-delay: 0.6s; }
        .animate-sections > *:nth-child(4) { animation-delay: 0.8s; }
        .animate-sections > *:nth-child(5) { animation-delay: 1.0s; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  );
}

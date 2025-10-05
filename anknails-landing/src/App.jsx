import Header from "./components/Header";
import Footer from "./components/Footer";
import MasterSection from "./components/MasterSection";
import PreEnrollButtonSection from "./components/PreEnrollButtonSection";
import CourseIntro from "./components/CourseIntro";
import ModulesList from "./components/ModulesList";
import ForWhomSection from "./components/ForWhomSection";
import TariffsSection from "./components/TariffsSection";
import PreEnrollPopup from "./components/PreEnrollPopup";
import FaqSection from "./components/FaqSection";
import CourseStart from "./components/CourseStart";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function App() {
  const { t } = useTranslation();
  const [toast, setToast] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handlePreorder = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center overflow-hidden bg-gradient-to-b from-[#ffe6eb] via-[#fff] to-[#fff5f7] dark:from-[#1a1a1a] dark:via-[#232323] dark:to-[#1a1a1a] text-center">
      {/* Фонове м’яке сяйво */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-200/40 dark:bg-pink-700/20 rounded-full blur-[160px] animate-pulse-slow -z-10"></div>

      <Header />

      <main
        className={`flex-grow w-full flex flex-col items-center justify-center px-4 z-10 pt-24 sm:pt-28 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Заголовок */}
        <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-sm animate-gradient-text bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 bg-[length:200%_200%] animate-bg-move">
          {t("title")}
        </h1>

        {/* Підзаголовок */}
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl animate-fade-up delay-200">
          {t("subtitle")}
        </p>

        {/* Контент */}
        <div className="space-y-20 animate-fade-up delay-300">
          <MasterSection />
          <PreEnrollButtonSection />
          <CourseIntro />
          <ModulesList />
          <ForWhomSection />
          <TariffsSection />
          <PreEnrollPopup/>
          <FaqSection />
          <CourseStart />
        </div>
      </main>

      <Footer />

      <style>{`
        /* ======== ANIMATIONS ======== */
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(236,72,153,0.3); }
          50% { box-shadow: 0 0 35px rgba(244,63,94,0.5); }
        }
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-fade-up {
          animation: fade-up 0.9s ease-out both;
        }
        .animate-glow {
          animation: glow 2.5s ease-in-out infinite;
        }
        .animate-bg-move {
          animation: gradient-move 6s ease infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}

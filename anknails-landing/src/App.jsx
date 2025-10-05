import Header from "./components/Header";
import Footer from "./components/Footer";
import MasterSection from "./components/MasterSection";
import PreEnrollButtonSection from "./components/PreEnrollButtonSection";
import CourseIntro from "./components/CourseIntro";
import ModulesList from "./components/ModulesList";
import ForWhomSection from "./components/ForWhomSection";
import StudentsWorksCarousel from "./components/StudentsWorksCarousel";
import TariffsSection from "./components/TariffsSection";
import PreEnrollPopup from "./components/PreEnrollPopup";
import FaqSection from "./components/FaqSection";
import CourseStart from "./components/CourseStart";
import { ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function App() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // показ кнопки при прокрутці
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center overflow-hidden bg-gradient-to-b from-[#ffe6eb] via-[#fff] to-[#fff5f7] dark:from-[#1a1a1a] dark:via-[#232323] dark:to-[#1a1a1a] text-center">
      {/* Фонове сяйво */}
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
          <StudentsWorksCarousel />
          <ForWhomSection />
          <TariffsSection />
          <PreEnrollPopup />
          <FaqSection />
          <CourseStart />
        </div>
      </main>

      <Footer />

      {/* Кнопка "наверх" */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-all duration-300 hover:scale-110 backdrop-blur-md border border-white/20"
          aria-label="Прокрутити догори"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-fade-up { animation: fade-up 0.9s ease-out both; }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-bg-move { animation: gradient-move 6s ease infinite; }
      `}</style>
    </div>
  );
}

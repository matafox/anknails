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

  // Показ кнопки при скролі
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400); // показуємо після 400px прокрутки
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

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
        <div className="space-y-8">
  <MasterSection />
  <PreEnrollButtonSection />
  <CourseIntro />
</div>
        <div className="space-y-20 animate-fade-up delay-300">
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
          className="fixed bottom-6 right-6 z-[9999]
                     bg-gradient-to-r from-pink-500 to-rose-500 
                     text-white p-3 rounded-full shadow-lg
                     hover:scale-110 hover:shadow-pink-400/50
                     transition-all duration-300 border border-white/30
                     backdrop-blur-md animate-glow"
          aria-label="Прокрутити догори"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px rgba(236,72,153,0.4); }
          50% { box-shadow: 0 0 25px rgba(244,63,94,0.6); }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

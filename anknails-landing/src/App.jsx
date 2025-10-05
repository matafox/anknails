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

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center overflow-hidden bg-gradient-to-b from-[#fff1f4] via-[#fff] to-[#fff9fa] dark:from-[#1a1a1a] dark:via-[#232323] dark:to-[#1a1a1a] text-center">
      {/* Фонове сяйво */}
      <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[500px] sm:w-[600px] h-[500px] sm:h-[600px] bg-pink-200/40 dark:bg-pink-700/20 rounded-full blur-[140px] animate-pulse-slow -z-10"></div>

      <Header />

      <main
        className={`flex-grow w-full flex flex-col items-center justify-center px-4 sm:px-6 z-10 pt-24 sm:pt-28 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Заголовок */}
        <h1 className="text-4xl xs:text-5xl sm:text-6xl font-extrabold mb-3 sm:mb-4 text-gray-900 dark:text-white drop-shadow-sm animate-gradient-text bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 bg-[length:200%_200%] animate-bg-move leading-tight">
          {t("title")}
        </h1>

        {/* Підзаголовок */}
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-md sm:max-w-xl leading-relaxed animate-fade-up delay-200">
          {t("subtitle")}
        </p>

        {/* Початкові модулі */}
        <div className="space-y-8 sm:space-y-10">
          <MasterSection />
          <PreEnrollButtonSection />
          <CourseIntro />
        </div>

        {/* Інші секції */}
        <div className="space-y-16 sm:space-y-20 mt-16 sm:mt-24 animate-fade-up delay-300">
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

      {/* Кнопка догори */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999]
                     bg-gradient-to-r from-pink-500 to-rose-500 
                     text-white p-3 sm:p-4 rounded-full shadow-lg
                     hover:scale-110 hover:shadow-pink-400/50
                     transition-all duration-300 border border-white/30
                     backdrop-blur-md animate-glow active:scale-95"
          aria-label="Прокрутити догори"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Анімації */}
      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px rgba(236,72,153,0.4); }
          50% { box-shadow: 0 0 25px rgba(244,63,94,0.6); }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

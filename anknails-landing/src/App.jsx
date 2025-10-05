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
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between items-center 
      overflow-x-hidden text-center 
      bg-gradient-to-b from-[#fff2f5] via-[#fff] to-[#fff9fa] 
      dark:from-[#141414] dark:via-[#1b1b1b] dark:to-[#141414]"
    >
      {/* Фонове сяйво */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-200/40 dark:bg-pink-700/20 rounded-full blur-[160px] animate-pulse-slow -z-10"></div>

      <Header />

      <main
        className={`flex-grow w-full flex flex-col items-center justify-center 
        px-4 sm:px-6 z-10 pt-24 sm:pt-28 
        transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.3,1)] 
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        {/* Заголовок */}
        <h1
          className="text-[2.2rem] sm:text-5xl md:text-6xl font-extrabold mb-3 sm:mb-4 
          text-gray-900 dark:text-white drop-shadow-sm 
          bg-clip-text text-transparent bg-gradient-to-r 
          from-pink-500 via-rose-500 to-pink-400 
          bg-[length:200%_200%] animate-bg-move 
          transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          {t("title")}
        </h1>

        {/* Підзаголовок */}
        <p
          className="text-base sm:text-lg text-gray-600 dark:text-gray-300 
          mb-8 sm:mb-10 max-w-md sm:max-w-xl leading-relaxed 
          animate-fade-up delay-200 transition-all duration-1000 ease-in-out"
        >
          {t("subtitle")}
        </p>

        {/* Початкові секції */}
        <div className="space-y-10 sm:space-y-12 motion-safe:animate-fade-up delay-300">
          <MasterSection />
          <PreEnrollButtonSection />
          <CourseIntro />
        </div>

        {/* Інші секції */}
        <div className="space-y-20 sm:space-y-24 mt-20 sm:mt-28 animate-fade-up delay-500">
          <ModulesList />
          <StudentsWorksCarousel />
          <ForWhomSection />
          <CourseStart />
          <TariffsSection />
          <PreEnrollPopup />
          <FaqSection />   
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
          hover:scale-110 active:scale-95
          hover:shadow-pink-400/50 transition-all duration-500 ease-out
          border border-white/30 backdrop-blur-md animate-glow"
          aria-label="Прокрутити догори"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      <style>{`
        html {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        body {
          overscroll-behavior-y: contain;
          scroll-behavior: smooth;
          scroll-snap-type: y proximity;
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px rgba(236,72,153,0.4); }
          50% { box-shadow: 0 0 25px rgba(244,63,94,0.6); }
        }
        .animate-glow { animation: glow 3s ease-in-out infinite; }

        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(25px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-fade-up { animation: fade-up 1.4s cubic-bezier(0.22,1,0.36,1) forwards; }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.04); }
        }
        .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }

        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-bg-move { animation: gradient-move 8s ease infinite; }
      `}</style>
    </div>
  );
}

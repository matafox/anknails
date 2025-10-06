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
  const [showScrollTop, setShowScrollTop] = useState(false);

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
      {/* Просте фонове сяйво */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-200/30 dark:bg-pink-700/10 rounded-full blur-[140px] -z-10"></div>

      <Header />

      <main className="flex-grow w-full flex flex-col items-center justify-center px-4 sm:px-6 z-10 pt-24 sm:pt-28">
        {/* Заголовок */}
        <h1 className="text-[2.2rem] sm:text-5xl md:text-6xl font-extrabold mb-3 sm:mb-4 text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400">
          {t("title")}
        </h1>

        {/* Підзаголовок */}
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-md sm:max-w-xl leading-relaxed">
          {t("subtitle")}
        </p>

        {/* Початкові секції */}
        <div className="space-y-10 sm:space-y-12">
          <MasterSection />
          <PreEnrollButtonSection />
          <CourseIntro />
        </div>

        {/* Інші секції */}
        <div className="space-y-20 sm:space-y-24 mt-20 sm:mt-28">
          <ModulesList />
          <StudentsWorksCarousel />
          <ForWhomSection />
          <div className="-mt-10 sm:-mt-12">
            <CourseStart />
          </div>
          <PreEnrollButtonSection />
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
          hover:shadow-pink-400/50 transition-transform duration-300
          border border-white/30 backdrop-blur-md"
          aria-label="Прокрутити догори"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  );
}

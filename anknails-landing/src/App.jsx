import Header from "./components/Header";
import Footer from "./components/Footer";
import MasterSection from "./components/MasterSection";
import PreorderCourse from "./components/PreorderCourse";
import PreEnrollButtonSection from "./components/PreEnrollButtonSection";
import CourseIntro from "./components/CourseIntro";
import ModulesList from "./components/ModulesList";
import BookingMessage from "./components/BookingMessage";
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMenuToggle = (e) => setMenuOpen(e.detail);
    window.addEventListener("menu-toggle", handleMenuToggle);
    return () => window.removeEventListener("menu-toggle", handleMenuToggle);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between items-center 
      overflow-x-hidden text-center 
      bg-gradient-to-b from-[#f6f0ff] via-[#fff] to-[#fdf9ff] 
      dark:from-[#100d16] dark:via-[#18141f] dark:to-[#100d16]"
    >
      {/* Фонове сяйво */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-fuchsia-300/30 dark:bg-fuchsia-700/10 rounded-full blur-[140px] -z-10"></div>

      <Header onMenuToggle={(open) => setMenuOpen(open)} />

      <main className="flex-grow w-full flex flex-col items-center justify-center px-4 sm:px-6 z-10 pt-24 sm:pt-28">
        {/* Заголовок + бейдж */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
          <h1 className="text-[2.2rem] sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400">
            {t("title")}
          </h1>

          {/* 🩷 Скляний бейдж “Скоро” */}
          <div className="px-4 py-1.5 rounded-full border border-white/40 dark:border-white/10 
                          bg-white/40 dark:bg-white/10 backdrop-blur-xl shadow-[0_0_20px_rgba(255,0,128,0.2)]
                          text-sm sm:text-base font-semibold text-fuchsia-600 dark:text-pink-300
                          flex items-center gap-2 select-none animate-fade-in">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full bg-pink-400 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex w-2 h-2 bg-pink-500 rounded-full"></span>
            </span>
            {t("soon_badge", "Скоро")}
          </div>
        </div>

        {/* Підзаголовок */}
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-md sm:max-w-xl leading-relaxed">
          {t("subtitle")}
        </p>

        {/* Початкові секції */}
        <div className="space-y-0 sm:space-y-0">
          <MasterSection />
          <PreorderCourse />
          <CourseIntro />
        </div>

        {/* Інші секції */}
        <div className="space-y-0 sm:space-y-0 mt-0 sm:mt-0">
          {/* Модулі */}
          <div id="modules" className="mb-10 sm:mb-16">
            <ModulesList />
          </div>

       <div className="space-y-20 sm:space-y-28">
  <div
    id="booking"
    className="mt-16 sm:mt-24 mb-16 sm:mb-28 px-4"
  >
    <BookingMessage />
  </div>

  <div id="forwhom" className="mt-10 sm:mt-16 mb-10 sm:mb-20">
    <ForWhomSection />
  </div>
</div>

          {/* Початок курсу */}
          <div id="coursestart" className="mt-10 sm:mt-16 mb-10 sm:mb-20">
            <CourseStart />
          </div>

          {/* Роботи студентів */}
          <div id="works" className="mt-10 sm:mt-16 mb-10 sm:mb-20">
            <StudentsWorksCarousel />
          </div>

          {/* Тарифи */}
          <div id="tariffs" className="mt-10 sm:mt-16 mb-10 sm:mb-20">
            <TariffsSection />
          </div>

          {/* Popup */}
          <PreEnrollPopup />

          <BookingMessage />

          {/* FAQ */}
          <div id="faq" className="mt-10 sm:mt-16 mb-10 sm:mb-20">
            <FaqSection />
          </div>
        </div>
      </main>

      <Footer />

      {/* Кнопка догори */}
      {showScrollTop && !menuOpen && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999]
          bg-gradient-to-r from-fuchsia-500 to-pink-500 
          text-white p-3 sm:p-4 rounded-full shadow-lg
          hover:scale-110 active:scale-95
          hover:shadow-fuchsia-400/50 transition-transform duration-300
          border border-white/30 backdrop-blur-md"
          aria-label="Прокрутити догори"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* 💫 CSS для fade-in */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}

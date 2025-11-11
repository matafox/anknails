import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PromoPopup from "./components/PromoPopup";
import MasterSection from "./components/MasterSection";
import PreorderCourse from "./components/PreorderCourse";
import CourseIntro from "./components/CourseIntro";
import ModulesList from "./components/ModulesList";
import BookingMessage from "./components/BookingMessage";
import ForWhomSection from "./components/ForWhomSection";
import StudentsWorksCarousel from "./components/StudentsWorksCarousel";
import TariffsSection from "./components/TariffsSection";
import PreEnrollPopup from "./components/PreEnrollPopup";
import FaqSection from "./components/FaqSection";
import CourseStart from "./components/CourseStart";
import PrivacyPage from "./pages/Privacy";

/* =========================
   Consent Banner (GA4, EU)
   ========================= */
function ConsentBanner({ show, onDecide }) {
  const { i18n } = useTranslation();
  const T = (ua, ru) => (i18n.language === "ru" ? ru : ua);
  if (!show) return null;

  const applyConsent = (granted) => {
    try {
      const g = typeof window !== "undefined" ? window.gtag : null;
      const val = granted ? "granted" : "denied";

      g && g("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: val,
        functionality_storage: "granted",
        security_storage: "granted",
      });

      localStorage.setItem("ga_consent", val);

      if (granted && g) {
        g("event", "page_view", {
          page_location: location.href,
          page_path: location.pathname + location.search,
          page_title: document.title,
        });
      }
    } catch {}
    onDecide?.();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[10000] px-3 pb-3 sm:px-6 sm:pb-6 pointer-events-none">
      <div className="pointer-events-auto max-w-5xl mx-auto rounded-2xl border shadow-xl 
                      bg-white/90 dark:bg-[#141017]/90 backdrop-blur-md 
                      border-pink-200/60 dark:border-fuchsia-900/40 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="text-left flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {T("Аналітичні cookies", "Аналитические cookies")}
            </h3>
            <p className="text-sm sm:text-[15px] text-gray-600 dark:text-gray-300 mt-1">
              {T(
                "Ми використовуємо Google Analytics для покращення платформи. Прийми або відхили аналітичні файли cookie.",
                "Мы используем Google Analytics для улучшения платформы. Примите или отклоните аналитические файлы cookie."
              )}{" "}
              {/* 👇 відкриваємо hash-маршрут, щоб не було 404 */}
              <a
                href="#/privacy"
                className="underline decoration-pink-400/70 hover:decoration-pink-500 text-pink-600 dark:text-fuchsia-300"
              >
                {T("Детальніше про приватність", "Подробнее о приватности")}
              </a>
              .
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => applyConsent(false)}
              className="px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold
                         border border-pink-300/70 dark:border-fuchsia-800/60
                         text-pink-700 dark:text-fuchsia-200
                         hover:bg-pink-50 dark:hover:bg-white/5 transition"
            >
              {T("Відхилити", "Отклонить")}
            </button>
            <button
              onClick={() => applyConsent(true)}
              className="px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold text-white
                         bg-gradient-to-r from-fuchsia-500 to-pink-500
                         hover:scale-[1.02] active:scale-[0.99] transition shadow"
            >
              {T("Прийняти", "Принять")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [needConsent, setNeedConsent] = useState(false);

  // стейт, щоб реагувати на зміну хешу
  const [hash, setHash] = useState(
    typeof window !== "undefined" ? window.location.hash : ""
  );

  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // ✅ ранній рендер privacy для:
  // 1) прямих переходів /privacy (якщо є редірект на index.html)
  // 2) hash-маршруту #/privacy (працює завжди, без налаштувань сервера)
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const search = typeof window !== "undefined" ? window.location.search : "";
  const isPrivacy =
    path.startsWith("/privacy") ||
    hash.startsWith("#/privacy") ||
    new URLSearchParams(search).get("page") === "privacy";

  if (isPrivacy) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onMenuToggle={(open) => setMenuOpen(open)} />
        <PrivacyPage />
        <Footer />
      </div>
    );
  }

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

  // Ініціалізація Consent Mode з localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ga_consent");
      const g = typeof window !== "undefined" ? window.gtag : null;

      if (saved === "granted" || saved === "denied") {
        g && g("consent", "update", {
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          analytics_storage: saved,
          functionality_storage: "granted",
          security_storage: "granted",
        });
        setNeedConsent(false);
      } else {
        setNeedConsent(true);
      }
    } catch {
      setNeedConsent(true);
    }
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between items-center 
      overflow-x-hidden text-center 
      bg-gradient-to-b from-[#f6f0ff] via-[#fff] to-[#fdf9ff] 
      dark:from-[#100d16] dark:via-[#18141f] dark:to-[#100d16]"
    >
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-fuchsia-300/30 dark:bg-fuchsia-700/10 rounded-full blur-[140px] -z-10"></div>

      <Header onMenuToggle={(open) => setMenuOpen(open)} />

      <main className="flex-grow w-full flex flex-col items-center justify-center px-4 sm:px-6 z-10 pt-24 sm:pt-28">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
          <h1 className="text-[2.2rem] sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400">
            {t("title")}
          </h1>
        </div>

        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-md sm:max-w-xl leading-relaxed">
          {t("subtitle")}
        </p>

        <div className="space-y-0 sm:space-y-0">
          <MasterSection />
          <PreorderCourse />
          <CourseIntro />
        </div>

        <div className="space-y-0 sm:space-y-0 mt-0 sm:mt-0">
          <div id="modules" className="mb-10 sm:mb-16">
            <ModulesList />
          </div>

          <div className="space-y-20 sm:space-y-28">
            <div id="booking" className="mt-16 sm:mt-24 mb-16 sm:mb-28 px-4">
              <BookingMessage />
            </div>

            <div id="forwhom" className="mt-10 sm:mt-16 mb-10 sm:mb-20">
              <ForWhomSection />
            </div>
          </div>

          <div id="coursestart" className="mt-10 sm:mt-16 mb-10 sm:mb-20">
            <CourseStart />
          </div>

          <div id="works" className="mt-10 sm:mt-16 mb-10 sm:mb-20">
            <StudentsWorksCarousel />
          </div>

          <div id="tariffs" className="mt-10 sm:mt-16 mb-10 sm:mb-20">
            <TariffsSection />
          </div>

          <PreEnrollPopup />
          <PromoPopup lang={i18n.language} onVisibleChange={setPopupVisible} />
          <BookingMessage />

          <div id="faq" className="mt-10 sm:mt-16 mb-10 sm:mb-20">
            <FaqSection />
          </div>
        </div>
      </main>

      <Footer />

      <ConsentBanner show={needConsent} onDecide={() => setNeedConsent(false)} />

      {showScrollTop && !menuOpen && !popupVisible && (
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
    </div>
  );
}

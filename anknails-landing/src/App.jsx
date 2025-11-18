import { useState, useEffect } from "react";
import { ChevronUp, Cookie as CookieIcon } from "lucide-react";
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
import TermsPage from "./pages/Terms";

/* 🎨 Нова палітра з картинки */
const P = {
  midnight: "#2E365A",   // top dark blue
  plum: "#6C5E82",       // muted purple
  dustyRose: "#AC91A7",  // dusty pink/lilac
  coral: "#D8737F",      // warm coral
  softBlue: "#96A4C5",   // soft bluish
  deepBlue: "#3F5B8B",   // bottom blue
};

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

      g &&
        g("consent", "update", {
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
          page_path: location.hash || location.pathname + location.search,
          page_title: document.title,
        });
      }
    } catch {}
    onDecide?.();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[10000] px-3 pb-3 sm:px-6 sm:pb-6 pointer-events-none">
      <div
        className="
          pointer-events-auto max-w-5xl mx-auto rounded-2xl border shadow-xl 
          bg-white/92 dark:bg-[#141725]/92 backdrop-blur-md 
          border-[color:rgba(150,164,197,0.7)] dark:border-[color:rgba(108,94,130,0.7)] 
          p-4 sm:p-5
        "
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="text-left flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-[color:#2E365A] dark:text-white flex items-center gap-2">
              <CookieIcon className="w-5 h-5 text-[color:#D8737F]" />
              {T("Аналітичні cookies", "Аналитические cookies")}
            </h3>
            <p className="text-sm sm:text-[15px] text-gray-600 dark:text-gray-300 mt-1">
              {T(
                "Ми використовуємо Google Analytics для покращення платформи. Прийми або відхили аналітичні файли cookie.",
                "Мы используем Google Analytics для улучшения платформы. Примите или отклоните аналитические файлы cookie."
              )}{" "}
              <a
                href="#/privacy"
                className="
                  underline 
                  decoration-[color:#D8737F] hover:decoration-[color:#3F5B8B] 
                  text-[color:#3F5B8B] dark:text-[color:#96A4C5]
                "
              >
                {T("Детальніше про приватність", "Подробнее о приватности")}
              </a>
              .
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => applyConsent(false)}
              className="
                px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold
                border border-[color:rgba(150,164,197,0.8)]
                text-[color:#2E365A] dark:text-[color:#E2E6FF]
                hover:bg-[color:rgba(150,164,197,0.12)] dark:hover:bg-white/5 
                transition
              "
            >
              {T("Відхилити", "Отклонить")}
            </button>
            <button
              onClick={() => applyConsent(true)}
              className="
                px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold text-white
                bg-[radial-gradient(circle_at_0%_0%,#D8737F,#3F5B8B)]
                hover:scale-[1.02] active:scale-[0.99] transition shadow
              "
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
  const [hash, setHash] = useState(
    typeof window !== "undefined" ? window.location.hash || "" : ""
  );

  // Авторедірект із прямих шляхів → hash-маршрути
  useEffect(() => {
    if (typeof window !== "undefined") {
      const { pathname, hash } = window.location;
      if (pathname.startsWith("/privacy") && !hash) {
        window.location.replace("/#/privacy");
      } else if (pathname.startsWith("/terms") && !hash) {
        window.location.replace("/#/terms");
      }
    }
  }, []);

  // Слухаємо hash-навігацію
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // GA page_view + скидання скролу на зміну хешу
  useEffect(() => {
    try {
      const g = window.gtag;
      const consent = localStorage.getItem("ga_consent");
      if (g && consent === "granted") {
        g("event", "page_view", {
          page_location: location.href,
          page_path: location.hash || location.pathname + location.search,
          page_title: document.title,
        });
      }
    } catch {}

    // ⬇️ службові сторінки — скрол на верх
    if (hash.startsWith("#/privacy") || hash.startsWith("#/terms")) {
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }, 0);
    }
  }, [hash]);

  const isPrivacy =
    (typeof window !== "undefined" &&
      window.location.pathname.startsWith("/privacy")) ||
    hash.startsWith("#/privacy");

  const isTerms =
    (typeof window !== "undefined" &&
      window.location.pathname.startsWith("/terms")) ||
    hash.startsWith("#/terms");

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
        g &&
          g("consent", "update", {
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

  /* ========= PRIVACY / TERMS ========= */
  if (isPrivacy || isTerms) {
    const Page = isPrivacy ? PrivacyPage : TermsPage;
    return (
      <div
        className="
          relative min-h-screen flex flex-col
          bg-[radial-gradient(circle_at_top,#96A4C5_0,#AC91A7_40%,#2E365A_100%)]
          dark:bg-[radial-gradient(circle_at_top,#050610_0,#2E365A_45%,#0B1022_100%)]
        "
      >
        <Header onMenuToggle={(open) => setMenuOpen(open)} />
        <main className="flex-grow w-full px-4 sm:px-6 z-10 pt-24 sm:pt-28">
          <Page />
        </main>
        <Footer />
        <ConsentBanner show={needConsent} onDecide={() => setNeedConsent(false)} />
      </div>
    );
  }

  /* ========= ГОЛОВНА ========= */
  return (
    <div
      className="
        relative min-h-screen flex flex-col justify-between items-center 
        overflow-x-hidden text-center 
        bg-[radial-gradient(circle_at_top,#96A4C5_0,#AC91A7_38%,#D8737F_65%,#3F5B8B_100%)]
        dark:bg-[radial-gradient(circle_at_top,#050610_0,#2E365A_35%,#3F5B8B_80%,#050610_100%)]
      "
    >
      {/* мʼяка розмита пляма під нові кольори */}
      <div
        className="
          absolute top-[-220px] left-1/2 -translate-x-1/2 
          w-[650px] h-[650px] rounded-full blur-[160px] -z-10
          bg-[radial-gradient(circle_at_30%_0%,rgba(150,164,197,0.55),transparent_55%),radial-gradient(circle_at_70%_40%,rgba(216,115,127,0.65),transparent_60%)]
        "
      />

      <Header onMenuToggle={(open) => setMenuOpen(open)} />

      <main className="flex-grow w-full flex flex-col items-center justify-center px-4 sm:px-6 z-10 pt-24 sm:pt-28">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
          <h1 className="text-[2.2rem] sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-[color:#2E365A] via-[color:#D8737F] to-[color:#3F5B8B]">
            {t("title")}
          </h1>
        </div>

        <p className="text-base sm:text-lg text-gray-100/0 md:text-gray-700 dark:text-gray-200 mb-8 sm:mb-10 max-w-md sm:max-w-xl leading-relaxed">
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

      {/* Банер згоди */}
      <ConsentBanner show={needConsent} onDecide={() => setNeedConsent(false)} />

      {showScrollTop && !menuOpen && !popupVisible && (
        <button
          onClick={scrollToTop}
          className="
            fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999]
            text-white p-3 sm:p-4 rounded-full shadow-lg
            bg-[radial-gradient(circle_at_0%_0%,#D8737F,#3F5B8B)]
            hover:scale-110 active:scale-95
            hover:shadow-[0_0_25px_rgba(63,91,139,0.6)]
            border border-white/30 backdrop-blur-md
            transition-transform duration-300
          "
          aria-label="Прокрутити догори"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  );
}

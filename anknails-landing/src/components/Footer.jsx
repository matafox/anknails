import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { i18n } = useTranslation();
  const acceptedText = i18n.language === "ru" ? "Мы принимаем" : "Ми приймаємо";
  const isAboutPage =
    typeof window !== "undefined" && window.location.hostname.includes("about.");

  const PRIV =
    i18n.language === "ru"
      ? "Политика конфиденциальности"
      : "Політика конфіденційності";
  const TERMS =
    i18n.language === "ru"
      ? "Условия пользования"
      : "Умови користування";

  return (
    <footer
      className="
        relative w-full z-10 py-8 px-4 
        flex flex-col items-center justify-center text-center 
        text-xs sm:text-sm
      "
    >
      {/* верхня тонка лінія */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[color:#96A4C5]/50 to-transparent dark:via-[color:#6C5E82]/50" />

      {!isAboutPage && (
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="font-medium text-sm sm:text-base text-[color:#2E365A] dark:text-[color:#E2E6FF]">
            {acceptedText}:
          </span>
          <div className="flex items-center gap-3 opacity-90">
            <img src="/applepay.svg" alt="Apple Pay" className="h-6 w-auto" />
            <img src="/visa.svg" alt="Visa" className="h-6 w-auto" />
            <img src="/mastercard.svg" alt="Mastercard" className="h-6 w-auto" />
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-[color:#4b5478] dark:text-[color:#BFC8F2] leading-relaxed">
        <span className="font-medium tracking-wide">
          © {new Date().getFullYear()} ANK Studio
        </span>

        <span className="hidden sm:inline text-[color:#96A4C5] dark:text-[color:#3F5B8B]">
          •
        </span>

        <span className="flex items-center gap-1.5">
          <span className="text-[color:#6C5E82] dark:text-[color:#96A4C5]">
            Made with
          </span>
          <Heart
            className="w-4 h-4 text-[color:#D8737F] drop-shadow-[0_0_6px_rgba(216,115,127,0.55)] animate-pulse"
            fill="currentColor"
          />
          <span className="text-[color:#6C5E82] dark:text-[color:#96A4C5]">
            by
          </span>
          <a
            href="https://t.me/mosaert"
            target="_blank"
            rel="noopener noreferrer"
            className="
              font-semibold 
              text-[color:#D8737F] hover:text-[color:#3F5B8B] 
              transition-colors 
              hover:underline underline-offset-2
            "
          >
            @mosaert
          </a>
        </span>
      </div>

      {/* лінки на hash-маршрути */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[color:#4b5478] dark:text-[color:#BFC8F2]">
        <a
          href="#/privacy"
          className="underline decoration-[color:#D8737F]/70 hover:decoration-[color:#3F5B8B]"
        >
          {PRIV}
        </a>
        <span className="hidden sm:inline">•</span>
        <a
          href="#/terms"
          className="underline decoration-[color:#D8737F]/70 hover:decoration-[color:#3F5B8B]"
        >
          {TERMS}
        </a>
      </div>

      {/* нижнє мʼяке сяйво */}
      <div
        className="
          absolute bottom-0 left-1/2 -translate-x-1/2 
          w-1/2 h-[2px] 
          bg-gradient-to-r from-transparent via-[color:#3F5B8B]/45 to-transparent 
          blur-sm dark:via-[color:#96A4C5]/40
        "
      />
    </footer>
  );
}

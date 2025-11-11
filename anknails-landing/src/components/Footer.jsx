import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { i18n } = useTranslation();
  const acceptedText = i18n.language === "ru" ? "Мы принимаем" : "Ми приймаємо";
  const isAboutPage =
    typeof window !== "undefined" && window.location.hostname.includes("about.");

  return (
    <footer className="relative w-full z-10 py-8 px-4 flex flex-col items-center justify-center text-center text-xs sm:text-sm">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-300/40 to-transparent dark:via-pink-700/30" />

      {!isAboutPage && (
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">
            {acceptedText}:
          </span>
          <div className="flex items-center gap-3 opacity-90">
            <img src="/applepay.svg" alt="Apple Pay" className="h-6 w-auto" />
            <img src="/visa.svg" alt="Visa" className="h-6 w-auto" />
            <img src="/mastercard.svg" alt="Mastercard" className="h-6 w-auto" />
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400 leading-relaxed">
        <span className="font-medium tracking-wide">
          © {new Date().getFullYear()} ANK Studio
        </span>

        <span className="hidden sm:inline text-gray-400 dark:text-gray-600">•</span>

        <span className="flex items-center gap-1.5">
          <span className="text-gray-5 00 dark:text-gray-400">Made with</span>
          <Heart className="w-4 h-4 text-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)] animate-pulse" fill="currentColor" />
          <span className="text-gray-500 dark:text-gray-400">by</span>
          <a
            href="https://t.me/mosaert"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-pink-500 hover:text-rose-600 transition-colors hover:underline underline-offset-2"
          >
            @mosaert
          </a>
        </span>
      </div>

      {/* 👇 лінк на hash-маршрут, щоб не ловити 404 */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-gray-600 dark:text-gray-400">
        <a
          href="#/privacy"
          className="underline decoration-pink-400/60 hover:decoration-pink-500"
        >
          {i18n.language === "ru" ? "Политика конфиденциальности" : "Політика конфіденційності"}
        </a>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-rose-300/40 to-transparent blur-sm dark:via-rose-600/30" />
    </footer>
  );
}

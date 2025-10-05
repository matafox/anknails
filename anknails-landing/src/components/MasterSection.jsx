import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Instagram, Send, X } from "lucide-react";

export default function MasterSection() {
  const { t } = useTranslation();
  const [showInsta, setShowInsta] = useState(false);

  return (
    <section className="relative w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 px-6 py-16">
      {/* background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-pink-300/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-rose-400/20 rounded-full blur-[120px]" />
      </div>

      {/* photo */}
      <div className="flex-shrink-0 w-[260px] h-[260px] rounded-full overflow-hidden shadow-xl border-4 border-white/60 dark:border-white/10">
        <img
          src="/master.jpg"
          alt="Майстер"
          className="w-full h-full object-cover"
        />
      </div>

      {/* text */}
      <div className="text-center md:text-left max-w-lg">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
          {t("master_title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          {t("master_about")}
        </p>

        {/* icons */}
        <div className="flex items-center justify-center md:justify-start gap-6">
          <button
            onClick={() => setShowInsta(true)}
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-pink-100/40 dark:bg-white/10 backdrop-blur-md border border-pink-300 dark:border-white/10 hover:scale-110 hover:bg-pink-200/50 transition-transform"
          >
            <Instagram className="w-6 h-6 text-pink-600 dark:text-pink-400 group-hover:text-pink-500 transition-colors" />
          </button>

          <a
            href="https://t.me/ank_studio"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-pink-100/40 dark:bg-white/10 backdrop-blur-md border border-pink-300 dark:border-white/10 hover:scale-110 hover:bg-pink-200/50 transition-transform"
          >
            <Send className="w-6 h-6 text-pink-600 dark:text-pink-400 group-hover:text-pink-500 transition-colors" />
          </a>
        </div>
      </div>

      {/* === INSTAGRAM MODAL === */}
      {showInsta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl h-[80vh] bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-pink-200/50 dark:border-neutral-700">
            <button
              onClick={() => setShowInsta(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/40 dark:bg-neutral-800/50 backdrop-blur-md hover:bg-pink-100/40 transition"
            >
              <X className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </button>

            <iframe
              src="https://www.instagram.com/ank.a_studio/embed"
              title="Instagram"
              className="w-full h-full"
              allowTransparency="true"
              frameBorder="0"
              scrolling="auto"
            />
          </div>
        </div>
      )}
    </section>
  );
}

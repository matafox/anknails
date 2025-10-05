import { useTranslation } from "react-i18next";
import { Instagram, Send } from "lucide-react"; // 👈 іконки з lucide-react

export default function MasterSection() {
  const { t } = useTranslation();

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

      {/* text block */}
      <div className="text-center md:text-left max-w-lg">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
          {t("master_title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          {t("master_about")}
        </p>

        {/* social icons */}
        <div className="flex items-center justify-center md:justify-start gap-6">
          <a
            href="https://www.instagram.com/ank.a_studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-pink-100/40 dark:bg-white/10 backdrop-blur-md border border-pink-300 dark:border-white/10 hover:scale-110 hover:bg-pink-200/50 transition-transform"
          >
            <Instagram className="w-6 h-6 text-pink-600 dark:text-pink-400 group-hover:text-pink-500 transition-colors" />
          </a>

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
    </section>
  );
}

import { useTranslation } from "react-i18next";
import { Instagram, Send } from "lucide-react";

export default function MasterSection() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between gap-10 px-6 py-16 text-center lg:text-left">
      {/* background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-pink-300/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-rose-400/20 rounded-full blur-[120px]" />
      </div>

      {/* photo */}
      <div className="flex justify-center w-full lg:w-auto">
        <div className="w-[260px] h-[260px] rounded-full overflow-hidden shadow-xl border-4 border-white/60 dark:border-white/10">
          <img
            src="/master.jpg"
            alt="Майстер"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* text + соцмережі */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
          {t("master_title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
          {t("master_about")}
        </p>

        <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
          {t("follow_me") || "Слідкуйте за мною:"}
        </h3>

        {/* іконки */}
        <div className="flex gap-5">
          <a
            href="https://www.instagram.com/ank.a_studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-11 h-11 rounded-full bg-pink-100/40 dark:bg-white/10 backdrop-blur-md border border-pink-300 dark:border-white/10 hover:scale-110 hover:bg-pink-200/50 transition-transform"
          >
            <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400 group-hover:text-pink-500 transition-colors" />
          </a>

          <a
            href="https://t.me/+nMaxkDtzIm45N2Iy"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-11 h-11 rounded-full bg-pink-100/40 dark:bg-white/10 backdrop-blur-md border border-pink-300 dark:border-white/10 hover:scale-110 hover:bg-pink-200/50 transition-transform"
          >
            <Send className="w-5 h-5 text-pink-600 dark:text-pink-400 group-hover:text-pink-500 transition-colors" />
          </a>
        </div>
      </div>

      {/* Instagram вікно */}
      <div className="hidden lg:block flex-shrink-0 w-[340px] h-[460px] rounded-2xl overflow-hidden border border-pink-200/50 dark:border-neutral-700 shadow-lg bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md">
        <iframe
          src="https://www.instagram.com/ank.a_studio/embed"
          title="Instagram"
          className="w-full h-full"
          allowTransparency="true"
          frameBorder="0"
          scrolling="auto"
        />
      </div>

      {/* на мобільних — Instagram блок нижче */}
      <div className="lg:hidden w-full max-w-[340px] mx-auto h-[460px] rounded-2xl overflow-hidden border border-pink-200/50 dark:border-neutral-700 shadow-lg bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md mt-8">
        <iframe
          src="https://www.instagram.com/ank.a_studio/embed"
          title="Instagram"
          className="w-full h-full"
          allowTransparency="true"
          frameBorder="0"
          scrolling="auto"
        />
      </div>
    </section>
  );
}

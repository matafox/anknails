import { useTranslation } from "react-i18next";

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
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {t("master_about")}
        </p>
      </div>
    </section>
  );
}

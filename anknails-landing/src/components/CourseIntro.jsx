import { useTranslation } from "react-i18next";

export default function CourseIntro() {
  const { t } = useTranslation();

  return (
    <section className="w-full max-w-4xl mx-auto text-center px-6 py-16">
      {/* модуль 1.0 */}
      <div className="rounded-3xl border border-pink-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md shadow-lg p-8 mb-8">
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
          {t("intro_module_title")}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {t("intro_module_desc")}
        </p>
      </div>
    </section>
  );
}

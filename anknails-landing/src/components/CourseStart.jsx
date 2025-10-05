import React from "react";
import { useTranslation } from "react-i18next";

export default function CourseStart() {
  const { t } = useTranslation();

  return (
    <section className="w-full max-w-4xl mx-auto text-center px-6 py-12">
      <div className="rounded-3xl border border-pink-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md shadow-lg p-10">
        {/* Заголовок */}
        <h3 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          {t("start_module_title")}
        </h3>

        {/* Підзаголовок */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 tracking-wide uppercase">
          {t("start_module_subtitle")}
        </p>

        {/* Опис */}
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          {t("start_module_desc")}
        </p>
      </div>
    </section>
  );
}

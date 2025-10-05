import React from "react";
import { useTranslation } from "react-i18next";

export default function CourseStart() {
  const { t } = useTranslation();

  return (
    <section className="w-full max-w-4xl mx-auto text-center px-6 py-12">
      <div className="rounded-3xl border border-pink-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md shadow-lg p-8">
        <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          {t("course_starts")}
        </p>
      </div>
    </section>
  );
}

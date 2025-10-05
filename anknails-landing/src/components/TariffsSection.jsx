import React from "react";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";

export default function TariffsSection() {
  const { t } = useTranslation();

  const tariffs = [
    {
      name: t("tariff_basic"),
      desc: t("tariff_basic_desc"),
      features: [
        { label: t("feature_theory"), included: true },
        { label: t("feature_practice"), included: true },
        { label: t("feature_feedback_chat"), included: false },
        { label: t("feature_homework"), included: false },
        { label: t("feature_zoom"), included: false },
      ],
    },
    {
      name: t("tariff_pro"),
      desc: t("tariff_pro_desc"),
      features: [
        { label: t("feature_theory"), included: true },
        { label: t("feature_practice"), included: true },
        { label: t("feature_feedback_chat"), included: true },
        { label: t("feature_homework"), included: true },
        { label: t("feature_zoom"), included: true },
      ],
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        {t("tariffs_title")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {tariffs.map((tariff, i) => (
          <div
            key={i}
            className={`rounded-3xl p-8 backdrop-blur-md shadow-lg transition-all ${
              i === 1
                ? "bg-pink-500/10 border-2 border-pink-400 dark:border-pink-500 hover:shadow-pink-300/40"
                : "bg-white/70 dark:bg-neutral-900/40 border border-pink-100 dark:border-neutral-700"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-3 ${
                i === 1
                  ? "text-pink-600 dark:text-pink-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {tariff.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {tariff.desc}
            </p>

            <ul className="space-y-3 text-left">
              {tariff.features.map((f, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {f.included ? (
                    <Check className="w-5 h-5 text-pink-500 shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400 dark:text-gray-600 shrink-0" />
                  )}
                  <span
                    className={`${
                      f.included
                        ? "text-gray-800 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400 line-through"
                    }`}
                  >
                    {f.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

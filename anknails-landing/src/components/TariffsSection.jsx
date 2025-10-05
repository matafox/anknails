import { useTranslation } from "react-i18next";
import { Check, X, FileText } from "lucide-react";

export default function TariffsSection() {
  const { t } = useTranslation();

  const tariffs = [
    {
      title: t("tariff_basic"),
      desc: t("tariff_basic_desc"),
      features: [
        { label: t("feature_theory"), included: true },
        { label: t("feature_practice"), included: true },
        { label: t("feature_feedback_chat"), included: false },
        { label: t("feature_homework").replace(" з перевіркою", ""), included: true },
        { label: t("feature_zoom"), included: false },
        { label: t("feature_certificate"), included: true },
      ],
      accent: "from-pink-400 to-rose-400",
    },
    {
      title: t("tariff_pro"),
      desc: t("tariff_pro_desc"),
      features: [
        { label: t("feature_theory"), included: true },
        { label: t("feature_practice"), included: true },
        { label: t("feature_feedback_chat"), included: true },
        { label: t("feature_homework"), included: true },
        { label: t("feature_zoom"), included: true },
        { label: t("feature_certificate"), included: true },
      ],
      accent: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-900 dark:text-white">
        {t("tariffs_title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {tariffs.map((plan, i) => (
          <div
            key={i}
            className={`relative rounded-3xl p-8 shadow-lg bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md border border-pink-100 dark:border-neutral-700 hover:shadow-pink-200 dark:hover:shadow-pink-900 transition-all`}
          >
            <h3
              className={`text-2xl font-semibold text-gray-900 dark:text-white mb-2`}
            >
              {plan.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {plan.desc}
            </p>

            <ul className="space-y-3 text-left">
              {plan.features.map((f, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between text-gray-700 dark:text-gray-300"
                >
                  <div className="flex items-center gap-2">
                    {f.included ? (
                      <Check className="w-5 h-5 text-pink-500" />
                    ) : (
                      <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    )}
                    <span>{f.label}</span>
                  </div>

                  {/* якщо сертифікат */}
                  {f.label.includes(t("feature_certificate")) && (
                    <div className="flex items-center gap-1 text-xs bg-pink-100/40 dark:bg-white/10 px-2 py-1 rounded-md text-pink-600 dark:text-pink-300 border border-pink-200/40 dark:border-white/10">
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div
              className={`absolute bottom-0 left-0 w-full h-1 rounded-b-3xl bg-gradient-to-r ${plan.accent}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

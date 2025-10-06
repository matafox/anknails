import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, FileText, Sparkles, Info } from "lucide-react";

export default function TariffsSection() {
  const { t, i18n } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);

  const tariffs = [
    {
      title: t("tariff_basic"),
      desc: t("tariff_basic_desc"),
      features: [
        { label: t("feature_theory"), included: true },
        { label: t("feature_practice"), included: true },
        { label: t("feature_homework"), included: false },
        { label: t("feature_feedback_chat"), included: false },
        { label: t("feature_zoom"), included: false },
        { label: t("feature_certificate"), included: true },
      ],
      highlight: false,
    },
    {
      title: t("tariff_pro"),
      desc: t("tariff_pro_desc"),
      features: [
        { label: t("feature_theory"), included: true },
        { label: t("feature_practice"), included: true },
        { label: t("feature_homework"), included: true },
        { label: t("feature_feedback_chat"), included: true },
        { label: t("feature_zoom"), included: true },
        { label: t("feature_certificate"), included: true },
      ],
      highlight: true,
    },
  ];

  const infoText =
    i18n.language === "ru"
      ? "Вся информация о ценах и возможности предзаказа появится на сайте немного позже."
      : "Уся інформація стосовно цін та можливості передзамовлення з’явиться на сайті трохи згодом.";

  const okText = i18n.language === "ru" ? "Хорошо, спасибо 💅" : "Добре, дякую 💅";

  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 py-16 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-900 dark:text-white">
        {t("tariffs_title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {tariffs.map((plan, i) => {
          const included = plan.features.filter((f) => f.included);
          const excluded = plan.features.filter((f) => !f.included);

          return (
            <div
              key={i}
              onClick={() => setShowInfo(true)}
              className={`relative cursor-pointer rounded-3xl p-8 shadow-lg backdrop-blur-md border transition-all duration-500 ${
                plan.highlight
                  ? "bg-gradient-to-br from-rose-500/40 to-pink-400/30 dark:from-rose-600/20 dark:to-pink-500/10 border-rose-300/60 shadow-pink-400/40 hover:shadow-pink-500/60"
                  : "bg-gradient-to-br from-gray-100/70 to-pink-50/50 dark:from-neutral-800/60 dark:to-neutral-900/40 border-gray-200/70 dark:border-neutral-700 hover:shadow-pink-100/40"
              }`}
            >
              {/* бейдж PRO */}
              {plan.highlight && (
                <div className="absolute -top-4 right-6">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold text-rose-600 dark:text-rose-200 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-rose-300/20 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    <Sparkles className="w-4 h-4 text-rose-500 dark:text-rose-300 animate-pulse" />
                    <span>{t("recommended", "Рекомендовано")}</span>
                  </div>
                </div>
              )}

              <h3
                className={`text-2xl font-semibold mb-2 ${
                  plan.highlight
                    ? "text-rose-700 dark:text-pink-300"
                    : "text-gray-800 dark:text-gray-100"
                }`}
              >
                {plan.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {plan.desc}
              </p>

              <ul className="space-y-3 text-left mb-6">
                {included.map((f, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between text-gray-700 dark:text-gray-300"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-pink-500" />
                      <span>{f.label}</span>
                    </div>

                    {f.label.includes(t("feature_certificate")) && (
                      <div className="flex items-center gap-1 text-xs bg-white/60 dark:bg-white/10 px-2 py-1 rounded-md text-rose-600 dark:text-pink-200 border border-white/40 dark:border-pink-200/20 backdrop-blur-md shadow-sm">
                        <FileText className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              <ul className="space-y-3 text-left opacity-70">
                {excluded.map((f, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
                  >
                    <X className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Інфо-модалка */}
      {showInfo && (
        <div
          onClick={() => setShowInfo(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-2xl border border-white/40 dark:border-neutral-700 rounded-3xl p-6 max-w-sm text-center shadow-2xl animate-pop flex flex-col items-center"
          >
            <Info className="w-8 h-8 mx-auto mb-3 text-pink-500" />
            <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed mb-6">
              {infoText}
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="px-5 py-2 rounded-full bg-white/60 dark:bg-white/10 border border-white/50 
              backdrop-blur-md shadow-md text-pink-600 dark:text-pink-300 font-medium 
              hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
            >
              <span>{okText}</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pop {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-pop { animation: pop 0.3s ease-out; }
      `}</style>
    </section>
  );
}

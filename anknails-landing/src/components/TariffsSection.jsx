import { Check, X, FileText, Sparkles, Tag, HelpCircle, ArrowRight, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TariffsSection() {
  const { t, i18n } = useTranslation();

  const STRIPE_LINKS = {
    basic: "https://buy.stripe.com/test_basic_checkout_link",
    pro: "https://buy.stripe.com/test_pro_checkout_link",
    consult: "https://buy.stripe.com/test_consult_50zl", // 🔹 посилання на оплату 50 zł
  };

  const tariffs = [
    {
      title: t("tariff_basic"),
      desc: t("tariff_basic_desc"),
      oldPrice: "990 zł",
      newPrice: "700 zł",
      stripe: STRIPE_LINKS.basic,
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
      oldPrice: "1390 zł",
      newPrice: "1000 zł",
      stripe: STRIPE_LINKS.pro,
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

  const handlePurchase = (url) => window.open(url, "_blank");

  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 py-16 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-900 dark:text-white">
        {t("tariffs_title")}
      </h2>

      {/* --- Блоки тарифів --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {tariffs.map((plan, i) => {
          const included = plan.features.filter((f) => f.included);
          const excluded = plan.features.filter((f) => !f.included);

          return (
            <div
              key={i}
              onClick={() => handlePurchase(plan.stripe)}
              className={`relative cursor-pointer rounded-3xl p-8 shadow-lg backdrop-blur-md border transition-all duration-500 hover:scale-[1.02] ${
                plan.highlight
                  ? "bg-gradient-to-br from-rose-500/40 to-pink-400/30 dark:from-rose-600/20 dark:to-pink-500/10 border-rose-300/60 shadow-pink-400/40 hover:shadow-pink-500/60"
                  : "bg-gradient-to-br from-gray-100/70 to-pink-50/50 dark:from-neutral-800/60 dark:to-neutral-900/40 border-gray-200/70 dark:border-neutral-700 hover:shadow-pink-100/40"
              }`}
            >
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

              <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.desc}</p>

              {/* Ціна */}
              <div className="relative inline-flex items-end gap-3 mb-8">
                <div className="flex flex-col items-center">
                  <span className="text-gray-400 dark:text-gray-500 text-sm line-through select-none">
                    {plan.oldPrice}
                  </span>
                  <span
                    className={`text-3xl font-extrabold tracking-tight ${
                      plan.highlight
                        ? "text-rose-600 dark:text-pink-300"
                        : "text-pink-600 dark:text-pink-400"
                    } animate-pulse-slow`}
                  >
                    {plan.newPrice}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border bg-white/60 dark:bg-white/10 border-pink-200/40 dark:border-pink-500/30 text-pink-600 dark:text-pink-300 font-medium backdrop-blur-sm shadow-sm">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{t("discount", "Акція до 10 листопада!")}</span>
                </div>
              </div>

              {/* Список включених */}
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

              {/* Виключені */}
              <ul className="space-y-3 text-left opacity-70">
                {excluded.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <X className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* --- Блок передоплати --- */}
      <div className="mt-8 max-w-2xl mx-auto text-center bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-pink-200/40 dark:border-pink-600/30 rounded-3xl p-8 shadow-lg">
        <div className="flex flex-col items-center gap-3 mb-5">
          <HelpCircle className="w-10 h-10 text-pink-500" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {i18n.language === "ru"
              ? "Не уверены, какой тариф выбрать?"
              : "Не впевнені, який тариф обрати?"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md">
            {i18n.language === "ru"
              ? "Внесите предоплату 50 zł и получите личную консультацию - я помогу подобрать оптимальный вариант обучения "
              : "Зробіть передоплату 50 zł і отримайте особисту консультацію - я допоможу підібрати найкращий варіант навчання "}
          </p>
        </div>

        <button
          onClick={() => handlePurchase(STRIPE_LINKS.consult)}
          className="mt-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>{i18n.language === "ru" ? "Сделать предоплату 50 zł" : "Зробити передоплату 50 zł"}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

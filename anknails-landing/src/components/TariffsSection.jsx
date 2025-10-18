import { useState, useEffect } from "react";
import { Check, X, FileText, Sparkles, Tag, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TariffsSection() {
  const { t, i18n } = useTranslation();
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        0
      );
      const diff = nextMidnight - now;

      if (diff <= 0) {
        setRemainingTime("00:00:00");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((diff / 1000) % 60)
        .toString()
        .padStart(2, "0");

      setRemainingTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // 💶 Ціни перераховані з PLN → EUR (~4.3 zł = 1 €)
  const tariffs = [
    {
      title: t("tariff_basic"),
      desc: t("tariff_basic_desc"),
      oldPrice: "230 €",
      newPrice: "165 €",
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
      oldPrice: "320 €",
      newPrice: "235 €",
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

  const handlePurchase = () =>
    window.open("https://www.instagram.com/ank.a_studio", "_blank");

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
              onClick={handlePurchase}
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

              {plan.highlight && (
                <p className="text-xs font-medium text-rose-600 dark:text-pink-300 mb-2">
                  {i18n.language === "ru"
                    ? "Количество мест ограничено"
                    : "Кількість місць обмежена"}
                </p>
              )}

              <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.desc}</p>

              {/* 💰 Ціна + таймер */}
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

                {/* 🕒 Таймер */}
                <div className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border bg-white/60 dark:bg-white/10 border-pink-200/40 dark:border-pink-500/30 text-pink-600 dark:text-pink-300 font-medium backdrop-blur-sm shadow-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {t("discount_timer", "Акція закінчиться через")} {remainingTime}
                  </span>
                </div>
              </div>

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

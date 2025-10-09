import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

export default function PreorderCourse() {
  const { i18n } = useTranslation();

  const scrollToTariffs = () => {
    const target = document.getElementById("tariffs");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="preorder"
      className="relative w-full flex flex-col items-center justify-center text-center py-28 px-6"
    >
      <div
        className="max-w-3xl w-full bg-white/40 dark:bg-white/10 backdrop-blur-2xl
        border border-pink-200/50 dark:border-neutral-700 rounded-3xl p-10 sm:p-16
        shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        {/* Заголовок */}
        <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 text-transparent bg-clip-text mb-6">
          {i18n.language === "ru"
            ? "Предзаказ курса открыт!"
            : i18n.language === "pl"
            ? "Przedsprzedaż kursu otwarta!"
            : i18n.language === "en"
            ? "Course preorder is open!"
            : "Передзамовлення курсу відкрито!"}
        </h2>

        {/* Пояснення */}
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          {i18n.language === "ru"
            ? "Стань одной из первых учениц и получи доступ по специальной цене!"
            : i18n.language === "pl"
            ? "Zostań jedną z pierwszych uczestniczek i zdobądź kurs w niższej cenie!"
            : i18n.language === "en"
            ? "Be among the first students and get access at a special price!"
            : "Стань однією з перших учениць і отримай доступ за спеціальною ціною!"}
        </p>

        {/* Стрілка вниз */}
        <button
          onClick={scrollToTariffs}
          className="group flex flex-col items-center justify-center text-pink-600 dark:text-pink-400 hover:text-rose-500 transition-all"
        >
          <ChevronDown className="w-12 h-12 animate-bounce-slow group-hover:translate-y-1 transition-transform duration-300" />
          <span className="mt-2 text-sm text-gray-600 dark:text-gray-400 opacity-80 group-hover:opacity-100 transition-opacity">
            {i18n.language === "ru"
              ? "Смотреть тарифы"
              : i18n.language === "pl"
              ? "Zobacz pakiety"
              : i18n.language === "en"
              ? "See plans"
              : "Дивитись тарифи"}
          </span>
        </button>
      </div>

      {/* Анімація стрілки */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.6s infinite;
        }
      `}</style>
    </section>
  );
}

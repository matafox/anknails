import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PreorderCourse() {
  const { i18n } = useTranslation();
  const isRu = i18n.language === "ru";

  const scrollToTariffs = () => {
    const target = document.getElementById("tariffs");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="preorder"
      className="relative w-full flex flex-col items-center justify-center text-center py-32 px-6"
    >
      {/* Текст */}
      <h2 className="text-4xl sm:text-5xl font-extrabold mb-8 bg-gradient-to-r from-pink-600 to-rose-500 text-transparent bg-clip-text">
        {isRu ? "Предзаказ курса открыт!" : "Передзамовлення курсу відкрито!"}
      </h2>

      <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl leading-relaxed mb-14">
        {isRu
          ? "Стань одной из первых учениц и получи доступ по специальной цене 💅"
          : "Стань однією з перших учениць і отримай доступ за спеціальною ціною 💅"}
      </p>

      {/* Кнопка зі стрілкою */}
      <button
        onClick={scrollToTariffs}
        className="group flex flex-col items-center justify-center bg-white text-pink-600 font-semibold
        rounded-full shadow-md hover:shadow-lg transition-all duration-300 px-6 py-3 hover:scale-105"
      >
        <ChevronDown className="w-8 h-8 animate-bounce-slow group-hover:translate-y-1 transition-transform duration-300" />
        <span className="mt-1 text-sm text-gray-600 group-hover:text-pink-600 transition-colors">
          {isRu ? "Смотреть тарифы" : "Дивитись тарифи"}
        </span>
      </button>

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

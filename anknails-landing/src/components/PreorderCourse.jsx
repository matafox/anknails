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
      {/* Заголовок */}
      <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 bg-gradient-to-r from-pink-600 to-rose-500 text-transparent bg-clip-text">
        {isRu ? "Курс уже стартовал!" : "Курс вже стартував!"}
      </h2>

      {/* Опис */}
      <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl leading-relaxed mb-10">
        {isRu
          ? "Присоединяйся сейчас и начинай обучение - доступ открыт к модулям и обновлениям."
          : "Приєднуйся зараз і починай навчання - доступ відкрито до модулів та оновлень."}
      </p>

      {/* Єдина кнопка: до тарифів */}
      <button
        onClick={scrollToTariffs}
        className="group flex items-center gap-2 bg-white text-pink-600 font-semibold
                   rounded-full shadow-md hover:shadow-lg transition-all duration-300
                   px-6 py-3 hover:scale-105"
      >
        <ChevronDown className="w-5 h-5 group-hover:translate-y-[2px] transition-transform duration-300" />
        <span>{isRu ? "Выбрать тариф" : "Обрати тариф"}</span>
      </button>
    </section>
  );
}

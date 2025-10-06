import React, { useState } from "react";
import { ChevronDown, CreditCard, BookOpenCheck, FileBadge2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FaqSection() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState([]); // ✅ кілька відкритих одночасно

  const toggleItem = (index) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      icon: <CreditCard />,
      question: t("faq_payment_question"),
      answer: t("faq_payment_answer"),
    },
    {
      icon: <BookOpenCheck />,
      question: t("faq_content_question"),
      answer: t("faq_content_answer"),
    },
    {
      icon: <FileBadge2 />,
      question: t("faq_certificate_question"),
      answer: t("faq_certificate_answer"),
    },
  ];

  return (
    <section className="w-full py-16 flex flex-col items-center justify-center px-4">
      {/* Заголовок */}
      <h2 className="text-4xl font-extrabold text-pink-600 dark:text-pink-400 mb-10 text-center">
        {t("faq_title")}
      </h2>

      {/* Контейнер */}
      <div className="w-full max-w-md sm:max-w-xl space-y-5">
        {faqs.map((faq, index) => {
          const isOpen = openItems.includes(index);
          return (
            <div
              key={index}
              className={`w-full rounded-2xl border border-pink-200/50 dark:border-neutral-700 
              bg-white/70 dark:bg-neutral-900/40 backdrop-blur-2xl shadow-sm transition-all duration-300`}
            >
              {/* Кнопка заголовка */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3 w-full">
                  {/* Іконка */}
                  <div
                    className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl border
                    ${
                      isOpen
                        ? "border-pink-400/70 bg-white/80 dark:bg-neutral-800/60"
                        : "border-pink-200/60 bg-white/60 dark:bg-neutral-800/50"
                    } backdrop-blur-md shadow-sm`}
                  >
                    {React.cloneElement(faq.icon, {
                      size: 20,
                      strokeWidth: 2.2,
                      className: "text-pink-500",
                    })}
                  </div>

                  {/* Текст питання */}
                  <span
                    className={`flex-1 text-[15px] sm:text-base font-semibold text-gray-900 dark:text-gray-100 
                    transition-all duration-300 ${
                      isOpen ? "whitespace-normal" : "truncate"
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>

                {/* Стрілка */}
                <ChevronDown
                  className={`w-5 h-5 text-pink-500 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Відповідь */}
              <div
                className={`px-5 pb-5 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed 
                transition-all duration-500 ease-in-out ${
                  isOpen
                    ? "max-h-[400px] opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

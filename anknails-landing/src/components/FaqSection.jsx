import React, { useState } from "react";
import {
  ChevronDown,
  CreditCard,
  BookOpenCheck,
  FileBadge2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FaqSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

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
    <section className="w-full py-16 px-4 sm:px-6 flex flex-col items-center justify-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent mb-10 text-center">
        {t("faq_title")}
      </h2>

      <div className="w-full max-w-2xl sm:max-w-3xl mx-auto space-y-5">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`relative bg-white/70 dark:bg-neutral-900/50 backdrop-blur-xl 
              border border-pink-200/50 dark:border-neutral-700 
              rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] 
              overflow-hidden transition-all duration-300`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 text-left"
              >
                {/* Іконка + текст */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Іконка у рамці */}
                  <div
                    className={`flex items-center justify-center flex-shrink-0
                    w-11 h-11 sm:w-12 sm:h-12 rounded-xl border
                    ${
                      isOpen
                        ? "border-pink-400/80 bg-white/80 dark:bg-neutral-800/60"
                        : "border-pink-200/60 bg-white/60 dark:bg-neutral-800/40"
                    } 
                    backdrop-blur-md shadow-sm`}
                  >
                    {React.cloneElement(faq.icon, {
                      size: 22,
                      strokeWidth: 2.2,
                      className: "text-pink-500",
                    })}
                  </div>

                  {/* Текст питання */}
                  <span
                    className={`block text-gray-900 dark:text-gray-100 font-semibold transition-all duration-300 ${
                      isOpen
                        ? "whitespace-normal text-base sm:text-lg leading-snug"
                        : "truncate text-base sm:text-lg max-w-[80%]"
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>

                {/* Стрілка */}
                <ChevronDown
                  className={`w-5 h-5 text-pink-500 flex-shrink-0 ml-2 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Відповідь */}
              <div
                className={`px-5 sm:px-6 pb-5 sm:pb-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed transition-all duration-500 ${
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

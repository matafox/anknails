import { useState } from "react";
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
      icon: <CreditCard className="w-6 h-6 text-pink-500" />,
      question: t("faq_payment_question"),
      answer: t("faq_payment_answer"),
    },
    {
      icon: <BookOpenCheck className="w-6 h-6 text-pink-500" />,
      question: t("faq_content_question"),
      answer: t("faq_content_answer"),
    },
    {
      icon: <FileBadge2 className="w-6 h-6 text-pink-500" />,
      question: t("faq_certificate_question"),
      answer: t("faq_certificate_answer"),
    },
  ];

  return (
    <section className="w-full py-20 flex flex-col items-center justify-center">
      {/* Заголовок */}
      <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-fuchsia-500 mb-10 text-center">
        {t("faq_title")}
      </h2>

      {/* Список FAQ */}
      <div className="w-full max-w-4xl px-6 space-y-5">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border border-pink-100 dark:border-pink-800 bg-white/70 dark:bg-neutral-900/60 shadow-sm backdrop-blur-md transition-all duration-200 ${
                isOpen
                  ? "ring-1 ring-pink-400/50 shadow-pink-200/40"
                  : "hover:ring-1 hover:ring-pink-300/30"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center px-6 py-5 text-left"
              >
                <div className="flex items-center gap-4">
                  {/* Іконка в рамці */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl border 
                      ${
                        isOpen
                          ? "border-pink-400/70 bg-white/70 dark:bg-neutral-800/60"
                          : "border-pink-200/60 bg-white/60 dark:bg-neutral-800/50"
                      } 
                      backdrop-blur-md shadow-sm transition-all duration-300`}
                  >
                    {faq.icon}
                  </div>

                  <span
                    className={`font-semibold text-base sm:text-lg text-gray-900 dark:text-white transition-colors ${
                      isOpen ? "text-pink-600 dark:text-pink-300" : ""
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-pink-500 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-5 text-gray-700 dark:text-gray-300 text-[15px] sm:text-base leading-relaxed transition-opacity duration-300">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

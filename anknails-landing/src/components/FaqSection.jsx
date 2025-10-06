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
      Icon: CreditCard,
      question: t("faq_payment_question"),
      answer: t("faq_payment_answer"),
    },
    {
      Icon: BookOpenCheck,
      question: t("faq_content_question"),
      answer: t("faq_content_answer"),
    },
    {
      Icon: FileBadge2,
      question: t("faq_certificate_question"),
      answer: t("faq_certificate_answer"),
    },
  ];

  return (
    <section className="w-full py-20 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-extrabold text-pink-600 dark:text-pink-400 mb-10 text-center">
        {t("faq_title")}
      </h2>

      <div className="w-full max-w-4xl px-4 sm:px-6 space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const Icon = faq.Icon;

          return (
            <div
              key={index}
              className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-2xl border border-pink-200/40 dark:border-neutral-700 rounded-2xl shadow-md overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Іконка в рамці */}
                  <div
                    className={`flex items-center justify-center w-11 h-11 flex-shrink-0 rounded-xl border transition-all duration-300 ${
                      isOpen
                        ? "border-pink-400/70 bg-white/80 dark:bg-neutral-800/70"
                        : "border-pink-200/50 bg-white/60 dark:bg-neutral-800/50"
                    }`}
                  >
                    <Icon
                      size={22}
                      strokeWidth={2.3}
                      className="text-pink-500"
                    />
                  </div>

                  {/* Текст питання */}
                  <span
                    className={`font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base transition-all duration-300 ${
                      isOpen
                        ? "whitespace-normal leading-snug"
                        : "truncate overflow-ellipsis max-w-[80%]"
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-pink-500 flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                className={`px-5 pb-5 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed transition-all duration-500 ${
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

import React, { useState } from "react";
import { ChevronDown, CreditCard, BookOpenCheck, FileBadge2 } from "lucide-react";
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
    <section className="w-full py-20 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-extrabold text-pink-600 dark:text-pink-400 mb-10 text-center">
        {t("faq_title")}
      </h2>

      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-md sm:max-w-2xl space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`w-full mx-auto bg-white/60 dark:bg-neutral-900/40 backdrop-blur-2xl 
                border border-pink-200/40 dark:border-neutral-700 
                rounded-2xl shadow-md overflow-hidden 
                transition-all duration-300`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left 
                  text-gray-900 dark:text-white font-semibold text-base sm:text-lg"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 max-w-full">
                    <div
                      className={`flex items-center justify-center flex-shrink-0 
                      w-10 h-10 rounded-xl border 
                      ${
                        isOpen
                          ? "border-pink-400/70 bg-white/70 dark:bg-neutral-800/60"
                          : "border-pink-200/60 bg-white/60 dark:bg-neutral-800/50"
                      } 
                      backdrop-blur-md shadow-sm`}
                    >
                      {React.cloneElement(faq.icon, {
                        size: 20,
                        strokeWidth: 2.2,
                        className: "text-pink-500",
                      })}
                    </div>

                    <span
                      className={`block text-gray-900 dark:text-gray-100 transition-all duration-300 
                      ${
                        isOpen
                          ? "whitespace-normal leading-snug"
                          : "truncate max-w-[80%]"
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
                  className={`px-5 pb-5 text-gray-700 dark:text-gray-300 text-base leading-relaxed 
                  transition-all duration-500 ${
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
      </div>
    </section>
  );
}

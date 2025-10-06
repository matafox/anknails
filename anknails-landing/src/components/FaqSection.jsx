import { useState } from "react";
import {
  ChevronDown,
  CreditCard,
  BookOpenCheck,
  FileBadge2,
  MessageCircleQuestion,
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
      {/* 🩵 Редизайн заголовка */}
      <div className="flex items-center gap-3 mb-10 px-4">
        <div className="p-3 rounded-2xl bg-white/50 dark:bg-white/10 backdrop-blur-lg border border-pink-200/40 dark:border-neutral-700 shadow-md">
          <MessageCircleQuestion className="w-6 h-6 text-pink-500" />
        </div>
        <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 drop-shadow-[0_0_20px_rgba(244,114,182,0.25)]">
          {t("faq_title", "Часті питання")}
        </h2>
      </div>

      <div className="w-full max-w-4xl px-4 sm:px-6 flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const Icon = faq.Icon;

          return (
            <div
              key={index}
              className={`relative bg-white/60 dark:bg-neutral-900/40 backdrop-blur-2xl 
              border border-pink-200/40 dark:border-neutral-700 
              rounded-2xl shadow-md transition-all duration-300`}
            >
              {/* Кнопка питання */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between px-5 py-5 text-left"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Іконка в рамці */}
                  <div
                    className={`flex items-center justify-center w-11 h-11 flex-shrink-0 rounded-xl border transition-all duration-300 
                      ${
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
                    className={`font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-snug line-clamp-2`}
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
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

              {/* Відповідь */}
              <div
                className={`px-5 pb-5 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed transition-all duration-500 ${
                  isOpen
                    ? "max-h-[200px] opacity-100"
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

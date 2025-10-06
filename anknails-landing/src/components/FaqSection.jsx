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
    <section className="relative w-full py-24 flex flex-col items-center justify-center">
      {/* фоновий розмитий еліпс */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-pink-200/20 dark:bg-pink-900/10 blur-[150px] rounded-full" />
      </div>

      <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 drop-shadow-sm mb-12 text-center">
        {t("faq_title")}
      </h2>

      <div className="w-full max-w-4xl px-6 space-y-5">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`relative rounded-3xl overflow-hidden transition-all duration-500 backdrop-blur-xl border group
                ${
                  isOpen
                    ? "bg-gradient-to-br from-white/70 to-pink-50/70 dark:from-neutral-800/70 dark:to-neutral-900/70 border-pink-200/60 dark:border-pink-800/40 shadow-[0_0_20px_rgba(236,72,153,0.25)]"
                    : "bg-white/40 dark:bg-neutral-800/40 border-white/30 dark:border-neutral-700 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]"
                }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center px-6 py-6 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl bg-gradient-to-tr from-pink-400/20 to-fuchsia-400/20 
                      ${isOpen ? "scale-110" : "scale-100"} transition-transform duration-300`}
                  >
                    {faq.icon}
                  </div>
                  <span className="font-semibold text-lg text-gray-900 dark:text-white tracking-wide">
                    {faq.question}
                  </span>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-pink-500 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Відповідь */}
              <div
                className={`px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-base transition-all duration-500 ease-out ${
                  isOpen
                    ? "max-h-[500px] opacity-100 translate-y-0"
                    : "max-h-0 opacity-0 -translate-y-2 overflow-hidden"
                }`}
              >
                <p>{faq.answer}</p>
              </div>

              {/* неоновий border при hover */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-pink-500/10 via-rose-400/10 to-fuchsia-500/10 blur-lg" />
            </div>
          );
        })}
      </div>
    </section>
  );
}

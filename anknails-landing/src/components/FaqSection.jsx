import { useState } from "react";
import { ChevronDown, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FaqSection() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <section className="w-full py-20 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-extrabold text-pink-600 dark:text-pink-400 mb-10 text-center">
        {t("faq_title", "Часті питання")}
      </h2>

      <div className="w-full max-w-4xl px-6">
        <div className="bg-white/50 dark:bg-neutral-900/40 backdrop-blur-2xl border border-pink-200/40 dark:border-neutral-700 rounded-2xl shadow-md overflow-hidden transition-all duration-300">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center px-6 py-5 text-left text-gray-900 dark:text-white font-semibold text-lg"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-pink-500" />
              {t("faq_payment_question", "Як буде проходити оплата?")}
            </div>
            <ChevronDown
              className={`w-5 h-5 text-pink-500 transition-transform duration-300 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Відповідь */}
          <div
            className={`px-6 pb-5 text-gray-700 dark:text-gray-300 text-base leading-relaxed transition-all duration-500 ${
              open
                ? "max-h-[300px] opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            {t(
              "faq_payment_answer",
              "Після натискання кнопки «Купити курс» ти перейдеш на сторінку безпечної оплати. Ми приймаємо банківські картки та Telegram Stars. Після успішної оплати отримаєш миттєвий доступ до уроків і лист із підтвердженням."
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

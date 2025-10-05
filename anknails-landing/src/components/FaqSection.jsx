import { useState } from "react";
import { ChevronDown, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FaqSection() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <section className="relative w-full py-20 flex flex-col items-center justify-center overflow-hidden">
      {/* Фон */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-pink-300/25 blur-[140px] rounded-full animate-float-slow"></div>
        <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] bg-fuchsia-400/25 blur-[150px] rounded-full animate-float-fast"></div>
      </div>

      {/* Заголовок */}
      <h2 className="text-4xl font-extrabold text-pink-600 dark:text-pink-400 mb-10 text-center">
        {t("faq_title", "Часті питання")}
      </h2>

      <div className="w-full max-w-4xl px-6">
        {/* Питання */}
        <div className="bg-white/30 dark:bg-neutral-900/40 backdrop-blur-2xl border border-pink-200/40 dark:border-neutral-700 rounded-2xl shadow-md overflow-hidden transition-all duration-300">
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
              "Після натискання кнопки «Записатися» ти перейдеш на сторінку безпечної оплати. Ми приймаємо банківські картки. Після успішної оплати отримаєш миттєвий доступ до курсу та лист із підтвердженням."
            )}
          </div>
        </div>
      </div>

      {/* Анімації */}
      <style jsx>{`
        @keyframes float-slow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(25px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-fast {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
          100% { transform: translateY(0px); }
        }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 9s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

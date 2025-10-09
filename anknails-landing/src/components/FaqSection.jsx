import { useState } from "react";
import {
  ChevronDown,
  CreditCard,
  BookOpenCheck,
  FileBadge2,
  MessageCircleQuestion,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { marked } from "marked";

export default function FaqSection() {
  const { t, i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      Icon: CreditCard,
      question:
        i18n.language === "ru"
          ? "Как проходит покупка курса?"
          : "Як відбувається купівля курсу?",
      answer:
        i18n.language === "ru"
          ? `
Оплата осуществляется через международную платформу **Stripe**, которая обеспечивает полную безопасность и поддержку всех банковских карт.  

После выбора тарифа пользователь попадает на страницу Stripe, где указывает данные карты и завершает оплату. Сразу после этого система отправляет письмо с подтверждением и доступом к обучению.  

Также предусмотрена **функция предоплаты 50 zł** - это возможность зарезервировать место в группе и получить консультацию перед покупкой.  
Благодаря этой функции студент может обсудить детали курса, убедиться, что программа подходит именно ему, и только потом завершить оплату.
`
          : `
Оплата здійснюється через міжнародну платформу **Stripe**, яка гарантує повну безпеку і підтримує всі банківські картки.  

Після вибору тарифу користувач переходить на сторінку Stripe, де вводить дані картки та завершує оплату. Одразу після цього система надсилає лист-підтвердження з доступом до навчання.  

Також є **функція передоплати 50 zł** - це можливість забронювати місце у групі та отримати консультацію перед оплатою.  
Завдяки цій функції студент може обговорити деталі курсу, переконатися, що програма підходить саме йому, і лише потім здійснити повну оплату.
`,
    },
    {
      Icon: BookOpenCheck,
      question:
        i18n.language === "ru"
          ? "Что входит в курс?"
          : "Що входить у курс?",
      answer:
        i18n.language === "ru"
          ? "Курс включает видеоматериалы, теорию, практические уроки и обратную связь (в зависимости от тарифа). Также предоставляется доступ к чату с учениками и дополнительным материалам."
          : "Курс включає відеоуроки, теорію, практичні завдання та зворотній зв’язок (залежно від тарифу). Також надається доступ до чату з ученицями та додаткових матеріалів.",
    },
    {
      Icon: FileBadge2,
      question:
        i18n.language === "ru"
          ? "Выдаётся ли сертификат?"
          : "Чи видається сертифікат?",
      answer:
        i18n.language === "ru"
          ? "Да. После успешного прохождения курса вы получите именной сертификат в PDF-формате, подтверждающий завершение программы."
          : "Так. Після успішного проходження курсу ви отримаєте іменний сертифікат у форматі PDF, що підтверджує завершення програми.",
    },
  ];

  return (
    <section className="w-full py-20 flex flex-col items-center justify-center">
      {/* 🩵 Заголовок */}
      <div className="flex items-center gap-3 mb-10 px-4">
        <div className="p-3 rounded-2xl bg-white/50 dark:bg-white/10 backdrop-blur-lg border border-pink-200/40 dark:border-neutral-700 shadow-md">
          <MessageCircleQuestion className="w-6 h-6 text-pink-500" />
        </div>
        <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 drop-shadow-[0_0_20px_rgba(244,114,182,0.25)]">
          {t("faq_title", "Часті питання")}
        </h2>
      </div>

      {/* 🩷 Питання */}
      <div className="w-full max-w-4xl px-4 sm:px-6 flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const Icon = faq.Icon;

          const htmlAnswer = marked.parse(faq.answer);

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
                  <div
                    className={`flex items-center justify-center w-11 h-11 flex-shrink-0 rounded-xl border transition-all duration-300 
                      ${
                        isOpen
                          ? "border-pink-400/70 bg-white/80 dark:bg-neutral-800/70"
                          : "border-pink-200/50 bg-white/60 dark:bg-neutral-800/50"
                      }`}
                  >
                    <Icon size={22} strokeWidth={2.3} className="text-pink-500" />
                  </div>

                  <span
                    className={`font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-snug`}
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
                    ? "max-h-[400px] opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <div
                  className="prose prose-pink dark:prose-invert text-right" // 🩷 додано text-right
                  dangerouslySetInnerHTML={{ __html: htmlAnswer }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

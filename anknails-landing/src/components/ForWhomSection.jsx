import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ForWhomSection() {
  const { t } = useTranslation();

  const beginners = [
    "Розібратись у матеріалах та інструментах",
    "Навчитись працювати з нижніми формами без страху",
    "Опанувати правильну архітектуру нігтя",
    "Створювати міцні й акуратні форми",
    "Розвинути впевненість у своїй роботі",
    "Почати приймати клієнтів і заробляти",
  ];

  const experienced = [
    "Довести техніку нарощування на нижні форми до ідеалу",
    "Працювати з екстрадовжиною легко і без стресу",
    "Прискорити процес і скоротити час роботи",
    "Удосконалити архітектуру й форму нігтів",
    "Робити міцне й при цьому естетичне нарощування",
    "Освоїти трендові 3D-дизайни",
    "Робити ефектні фото своїх робіт, які продають",
    "Підвищити чек і впевненість у собі",
    "Структурувати знання та вийти на рівень викладача",
    "Отримати натхнення й знову кайфувати від процесу",
  ];

  const learning = [
    "Курс розміщений на платформі",
    "Уроки в записі — можна дивитись у зручному темпі та будь-коли",
    "Короткі уроки від 6 до 20 хвилин, без води — тільки головне",
    "Усе чітко структуровано та розкладено по поличках",
  ];

  return (
    <section className="w-full max-w-6xl px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Початківці */}
      <div className="bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md border border-pink-100 dark:border-neutral-700 rounded-2xl p-8 shadow-md hover:shadow-pink-200/40 transition-all">
        <h2 className="text-2xl font-bold mb-6 text-pink-600 dark:text-pink-400">
          {t("for_beginners_title", "ДЛЯ ПОЧАТКІВЦІВ")}
        </h2>
        <ul className="space-y-3 text-left text-gray-700 dark:text-gray-300">
          {beginners.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Досвідчені */}
      <div className="bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md border border-pink-100 dark:border-neutral-700 rounded-2xl p-8 shadow-md hover:shadow-pink-200/40 transition-all">
        <h2 className="text-2xl font-bold mb-6 text-pink-600 dark:text-pink-400">
          {t("for_experienced_title", "ДЛЯ ДОСВІДЧЕНИХ МАЙСТРІВ")}
        </h2>
        <ul className="space-y-3 text-left text-gray-700 dark:text-gray-300">
          {experienced.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Як проходить навчання */}
      <div className="md:col-span-2 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md border border-pink-100 dark:border-neutral-700 rounded-2xl p-8 shadow-md hover:shadow-pink-200/40 transition-all">
        <h2 className="text-2xl font-bold mb-6 text-pink-600 dark:text-pink-400">
          {t("how_learning_title", "ЯК БУДЕ ПРОХОДИТИ НАВЧАННЯ")}
        </h2>
        <ul className="space-y-3 text-left text-gray-700 dark:text-gray-300">
          {learning.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

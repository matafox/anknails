import { useTranslation } from "react-i18next";

export default function ModulesList() {
  const { t } = useTranslation();
  const modules = t("modules_full", { returnObjects: true });

  // 🟧 Помаранчева для "Теорія", 🩷 Рожева для "Практика"
  const badgeClass = (type) =>
    type === "Теорія"
      ? "bg-orange-500/20 text-orange-700 dark:bg-orange-400/20 dark:text-orange-200"
      : "bg-pink-500/20 text-pink-700 dark:bg-pink-400/20 dark:text-pink-200";

  return (
    <div className="w-full max-w-6xl px-6 mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white/60 dark:bg-white/10 border border-pink-100 dark:border-neutral-700 shadow-lg backdrop-blur-md"
          >
            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
              {m.title}
            </h2>

            <ul className="text-left text-gray-700 dark:text-gray-300 space-y-2 text-sm">
              {m.lessons.map((lesson, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between border-b border-pink-100/30 pb-1"
                >
                  <span>•&nbsp;{lesson.name}</span>
                  <span
                    className={`${badgeClass(
                      lesson.type
                    )} px-3 py-1 text-xs font-medium rounded-full shadow-sm`}
                  >
                    {lesson.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* 🎁 Бонусний урок */}
        <div className="p-6 rounded-2xl border-2 border-pink-400 dark:border-pink-500 bg-pink-50/60 dark:bg-pink-900/30 shadow-lg backdrop-blur-md sm:col-span-2 lg:col-span-3 text-center">
          <h2 className="text-xl font-bold mb-3 text-pink-700 dark:text-pink-300 uppercase tracking-wide">
            {t("bonus_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-200 font-medium">
            {t("bonus_desc")}
          </p>
        </div>
      </div>
    </div>
  );
}

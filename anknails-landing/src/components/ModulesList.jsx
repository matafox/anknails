import { useTranslation } from "react-i18next";

export default function ModulesList() {
  const { t } = useTranslation();

  const modules = t("modules_full", { returnObjects: true });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-6">
      {modules.map((m, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl bg-white/60 dark:bg-white/10 border border-pink-100 dark:border-neutral-700 shadow-lg backdrop-blur-md hover:shadow-pink-200 dark:hover:shadow-pink-900 transition-all"
        >
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
            {m.title}
          </h2>
          <ul className="text-left text-gray-700 dark:text-gray-300 space-y-1 text-sm">
            {m.lessons.map((lesson, idx) => (
              <li key={idx}>– {lesson}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

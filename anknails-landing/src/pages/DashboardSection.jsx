// src/pages/DashboardSection.jsx
import { CheckSquare } from "lucide-react";

export default function DashboardSection({
  modules,
  lessons,
  progress,
  overallProgress,
  darkMode,
  t,
}) {
  return (
    <div
      className={`max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 ${
        darkMode ? "text-fuchsia-100" : "text-gray-800"
      }`}
    >
      {/* 📦 Модулі */}
      <div
        className={`p-6 rounded-2xl border shadow-md ${
          darkMode
            ? "bg-[#1a0a1f]/70 border-fuchsia-900/30"
            : "bg-white border-pink-200"
        }`}
      >
        <h3 className="text-xl font-bold mb-3 text-pink-600">
          {t("Мої модулі", "Мои модули")}
        </h3>
        {modules.length === 0 ? (
          <p className="text-sm opacity-70">
            {t("Модулів поки що немає", "Модулей пока нет")}
          </p>
        ) : (
          <ul className="space-y-2">
            {modules.map((mod) => (
              <li
                key={mod.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                  darkMode ? "bg-fuchsia-950/40" : "bg-pink-50"
                }`}
              >
                <span className="font-medium">{mod.title}</span>
                <span className="text-sm text-pink-500">
                  {(lessons[mod.id]?.length || 0)} уроків
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 📈 Прогрес */}
      <div
        className={`p-6 rounded-2xl border shadow-md ${
          darkMode
            ? "bg-[#1a0a1f]/70 border-fuchsia-900/30"
            : "bg-white border-pink-200"
        }`}
      >
        <h3 className="text-xl font-bold mb-3 text-pink-600">
          {t("Прогрес курсу", "Прогресс курса")}
        </h3>
        <div className="text-center">
          <p className="text-5xl font-extrabold text-pink-500 mb-2">
            {overallProgress}%
          </p>
          <div className="h-2 w-full bg-pink-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="text-sm opacity-70">
            {t("Ви переглянули", "Вы просмотрели")}{" "}
            {Object.values(progress).filter((p) => p.completed).length}{" "}
            {t("уроків з", "уроков из")}{" "}
            {Object.values(progress).length}
          </p>
        </div>
      </div>

      {/* 🧾 Домашні завдання */}
      <div
        className={`p-6 rounded-2xl border shadow-md md:col-span-2 ${
          darkMode
            ? "bg-[#1a0a1f]/70 border-fuchsia-900/30"
            : "bg-white border-pink-200"
        }`}
      >
        <h3 className="text-xl font-bold mb-3 text-pink-600 flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-pink-500" />
          {t("Домашні завдання", "Домашние задания")}
        </h3>
        <p className="text-sm opacity-80">
          {t("Виконано завдань:", "Выполнено заданий:")}{" "}
          {Object.values(progress).filter((p) => p.homework_done).length}
        </p>
      </div>
    </div>
  );
}

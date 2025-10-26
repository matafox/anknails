// src/pages/DashboardSection.jsx
import { CheckSquare, Star, Info } from "lucide-react";
import { useState } from "react";

export default function DashboardSection({
  modules,
  lessons,
  progress,
  overallProgress,
  darkMode,
  t,
}) {
  // 🧮 XP та рівень
  const completedLessons = Object.values(progress).filter((p) => p.completed).length;
  const xp = completedLessons * 20;
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXP = 100 * level;
  const progressToNext = ((xp % 100) / 100) * 100;

  // 🎓 інфо про XP
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div
      className={`min-h-[calc(100vh-8rem)] flex flex-col justify-between ${
        darkMode ? "text-fuchsia-100" : "text-gray-800"
      }`}
    >
      <div className="flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 📦 Модулі */}
          <div
            className={`relative p-6 rounded-2xl border shadow-md transition ${
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
                      {(lessons[mod.id]?.length || 0)} {t("уроків", "уроков")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 📈 Прогрес курсу */}
          <div
            className={`p-6 rounded-2xl border shadow-md transition ${
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

          {/* ⭐ Рівень користувача */}
          <div
            className={`relative p-6 rounded-2xl border shadow-md overflow-hidden transition ${
              darkMode
                ? "bg-gradient-to-br from-[#1a0a1f] to-fuchsia-950/50 border-fuchsia-900/30"
                : "bg-gradient-to-br from-white to-pink-50 border-pink-200"
            }`}
          >
            {/* кнопка інформації */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-pink-100/30 transition"
              title={t("Як заробляти XP", "Как зарабатывать XP")}
            >
              <Info className="w-5 h-5 text-pink-500" />
            </button>

            {/* інфо-панель */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 backdrop-blur-md transition-all duration-500 ${
                showInfo
                  ? "opacity-100 visible bg-gradient-to-br from-black/80 via-fuchsia-950/80 to-pink-950/60 scale-100 shadow-[0_0_40px_rgba(255,215,0,0.4)]"
                  : "opacity-0 invisible scale-95"
              }`}
              onClick={() => setShowInfo(false)}
            >
              <p className="text-lg font-bold text-yellow-400 mb-2 drop-shadow-[0_0_5px_rgba(255,215,0,0.6)]">
                {t("Як заробляти XP", "Как зарабатывать XP")}
              </p>
              <p className="text-sm font-medium text-yellow-300 drop-shadow-[0_0_4px_rgba(255,215,0,0.7)] leading-relaxed">
                {t(
                  "Завершуйте уроки, щоб отримувати XP. Кожен завершений урок приносить 20 XP. Кожні 100 XP — новий рівень!",
                  "Проходите уроки, чтобы получать XP. За каждый урок начисляется 20 XP. Каждые 100 XP — новый уровень!"
                )}
              </p>
            </div>

            <h3 className="text-xl font-bold mb-4 text-pink-600 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              {t("Рівень учня", "Уровень ученика")}
            </h3>
            <div className="text-center">
              <p className="text-5xl font-extrabold text-pink-500 mb-1">
                {t("Lv.", "Ур.")} {level}
              </p>
              <p className="text-sm opacity-70 mb-3">
                {xp} XP / {nextLevelXP} XP
              </p>
              <div className="h-2 w-full bg-pink-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-pink-500 transition-all duration-700"
                  style={{ width: `${progressToNext}%` }}
                ></div>
              </div>
              <p className="text-xs opacity-60">
                {t("До наступного рівня залишилось", "До следующего уровня осталось")}{" "}
                {100 - (xp % 100)} XP
              </p>
            </div>
          </div>

          {/* 🧾 Домашні завдання */}
          <div
            className={`p-6 rounded-2xl border shadow-md transition ${
              darkMode
                ? "bg-[#1a0a1f]/70 border-fuchsia-900/30"
                : "bg-white border-pink-200"
            }`}
          >
            <h3 className="text-xl font-bold mb-3 text-pink-600 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-pink-500" />
              {t("Домашні завдання", "Домашние задания")}
            </h3>
            <p className="text-sm opacity-80 mb-2">
              {t("Виконано завдань:", "Выполнено заданий:")}{" "}
              {Object.values(progress).filter((p) => p.homework_done).length}
            </p>
            <div className="h-2 w-full bg-pink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
                style={{
                  width: `${
                    (Object.values(progress).filter((p) => p.homework_done).length /
                      Math.max(Object.values(progress).length, 1)) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

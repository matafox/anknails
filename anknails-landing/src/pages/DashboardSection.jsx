// src/pages/DashboardSection.jsx
import { useEffect, useState } from "react";
import { CheckSquare, Star, Info, X } from "lucide-react";

const BACKEND = "https://anknails-backend-production.up.railway.app";

export default function DashboardSection({
  modules,
  lessons,
  progress,
  overallProgress,
  darkMode,
  t,
  user,
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [xp, setXp] = useState(user?.xp || 0);
  const [level, setLevel] = useState(user?.level || 1);

  // 🧩 Підтягування XP і рівня з бекенду
  useEffect(() => {
    if (!user?.id) return;
    fetch(`${BACKEND}/api/progress/user/${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.xp !== undefined) {
          setXp(data.xp);
          setLevel(data.level);
        }
      })
      .catch((err) => console.warn("⚠️ XP fetch failed", err));
  }, [user?.id]);

  const completedLessons = Object.values(progress).filter((p) => p.completed).length;
  const realXp = xp ?? completedLessons * 20;
  const realLevel = level ?? Math.floor(realXp / 100) + 1;
  const nextLevelXP = 100 * realLevel;
  const progressToNext = ((realXp % 100) / 100) * 100;

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
  className={`relative p-6 rounded-2xl border shadow-md transition overflow-y-auto max-h-[400px] ${
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
                {completedLessons} {t("уроків з", "уроков из")}{" "}
                {Object.values(progress).length}
              </p>
            </div>
          </div>

          {/* ⭐ Рівень користувача */}
          <div
            className={`relative p-6 rounded-2xl border shadow-md overflow-hidden transition-all duration-700 ${
              darkMode
                ? "bg-gradient-to-br from-[#1a0a1f] to-fuchsia-950/50 border-fuchsia-900/30"
                : "bg-gradient-to-br from-white to-pink-50 border-pink-200"
            }`}
          >
            {/* кнопка інформації */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-pink-100/30 transition z-20"
              title={t("Як заробляти XP", "Как зарабатывать XP")}
            >
              {showInfo ? (
                <X className="w-5 h-5 text-yellow-400" />
              ) : (
                <Info className="w-5 h-5 text-pink-500" />
              )}
            </button>

            {/* контент з плавним переходом */}
            <div
              className={`transition-all duration-700 ease-out transform ${
                showInfo
                  ? "opacity-0 scale-95 pointer-events-none"
                  : "opacity-100 scale-100"
              }`}
            >
              <h3 className="text-xl font-bold mb-4 text-pink-600 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                {t("Мій рівень", "Мой уровень")}
              </h3>
              <div className="text-center">
                <p className="text-5xl font-extrabold text-pink-500 mb-1">
                  {t("Lv.", "Ур.")} {realLevel}
                </p>
                <p className="text-sm opacity-70 mb-3">
                  {realXp} XP / {nextLevelXP} XP
                </p>
                <div className="h-2 w-full bg-pink-100 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-pink-500 transition-all duration-700"
                    style={{ width: `${progressToNext}%` }}
                  ></div>
                </div>
                <p className="text-xs opacity-60">
                  {t(
                    "До наступного рівня залишилось",
                    "До следующего уровня осталось"
                  )}{" "}
                  {100 - (realXp % 100)} XP
                </p>
              </div>
            </div>

            {/* інфо-екран */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-center p-8 transition-all duration-700 ease-out transform ${
                showInfo
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible pointer-events-none"
              }`}
            >
              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-700 ${
                  darkMode
                    ? "bg-black/80 backdrop-blur-md border border-fuchsia-900/30"
                    : "bg-gradient-to-br from-pink-100 to-white backdrop-blur-md border border-pink-200/50"
                }`}
              ></div>

             <div className="relative z-10 animate-fade-in text-center">
  <h3
    className={`text-2xl font-bold mb-3 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]`}
  >
    {t("Як заробляти XP", "Как зарабатывать XP")}
  </h3>
  <p
    className={`text-sm md:text-base font-medium leading-relaxed max-w-md mx-auto mb-5 ${
      darkMode
        ? "text-fuchsia-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]"
        : "text-gray-700 drop-shadow-[0_0_6px_rgba(0,0,0,0.15)]"
    }`}
  >
    {t(
      "Завершуйте уроки, щоб отримувати XP. Кожен завершений урок приносить 20 XP. Кожні 100 XP - новий рівень! Виконуйте домашні завдання - отримуйте бонусні 10 XP.",
      "Проходите уроки, чтобы получать XP. За каждый урок начисляется 20 XP. Каждые 100 XP - новый уровень! Выполняйте домашние задания - бонус 10 XP."
    )}
  </p>
</div>

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

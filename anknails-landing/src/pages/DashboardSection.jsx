// src/pages/DashboardSection.jsx
import { useEffect, useState } from "react";
import { CheckSquare, Award, Info, X } from "lucide-react";

const BACKEND = "https://anknails-backend-production.up.railway.app";

// 🎨 Кольори для кожного рівня (1–5)
const STAGE_COLORS = {
  1: "from-pink-100 to-pink-50 border-pink-200 text-pink-600",
  2: "from-rose-100 to-rose-50 border-rose-200 text-rose-600",
  3: "from-fuchsia-100 to-pink-50 border-fuchsia-200 text-fuchsia-600",
  4: "from-violet-100 to-purple-50 border-violet-200 text-violet-600",
  5: "from-yellow-100 to-amber-50 border-yellow-300 text-yellow-700",
};

export default function DashboardSection({
  modules,
  lessons,
  progress,
  overallProgress,
  darkMode,
  t,
  user,
  onOpenModules,
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [skills, setSkills] = useState(user?.xp || 0);
  const [stage, setStage] = useState(user?.level || 1);
  const [localLessons, setLocalLessons] = useState(lessons || {});

  // 🧩 Підтягування навичок і етапу майстерності
  useEffect(() => {
    if (!user?.id) return;
    fetch(`${BACKEND}/api/progress/user/${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.xp !== undefined) {
          setSkills(data.xp);
          setStage(data.level);
        }
      })
      .catch((err) => console.warn("⚠️ Skills fetch failed", err));
  }, [user?.id]);

  // 🧠 Підтягування кількості уроків
  useEffect(() => {
    if (!modules?.length) return;

    const fetchAllLessons = async () => {
      const updated = {};
      for (const mod of modules) {
        try {
          const res = await fetch(`${BACKEND}/api/lessons/${mod.id}`);
          const data = await res.json();
          updated[mod.id] = data.lessons || [];
        } catch (err) {
          console.warn("⚠️ lesson fetch failed", mod.id, err);
        }
      }
      setLocalLessons(updated);
    };

    fetchAllLessons();
  }, [modules]);

  // 🧮 Обчислення
  const completedLessons = Object.values(progress).filter((p) => p.completed).length;
  const realSkills = skills ?? completedLessons * 20;
  const realStage = Math.min(stage ?? Math.floor(realSkills / 100) + 1, 5);
  const nextStageSkills = 100 * realStage;
  const progressToNext = ((realSkills % 100) / 100) * 100;

  // 🎨 Поточний колір рівня
  const stageColor = STAGE_COLORS[realStage] || STAGE_COLORS[5];

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
  onClick={() => onOpenModules && onOpenModules()} // 🟣 відкриває сторінку модулів
  className={`relative p-6 rounded-2xl border shadow-md transition overflow-y-auto max-h-[400px] cursor-pointer hover:scale-[1.02] ${
    darkMode
      ? "bg-[#1a0a1f]/70 border-fuchsia-900/30 hover:border-pink-500/40"
      : "bg-white border-pink-200 hover:border-pink-400/70"
  }`}
>
  <h3 className="text-xl font-bold mb-3 text-pink-600 flex justify-between items-center">
    <span>{t("Мої модулі", "Мои модули")}</span>
    <span className="text-sm text-pink-400 opacity-80">
      {t("переглянути всі", "посмотреть все")} →
    </span>
  </h3>

  {modules.length === 0 ? (
    <p className="text-sm opacity-70">
      {t("Модулів поки що немає", "Модулей пока нет")}
    </p>
  ) : (
    <ul className="space-y-2">
      {modules.slice(0, 3).map((mod) => ( // показує лише 3 модулі прев’ю
        <li
          key={mod.id}
          className={`flex items-center justify-between px-3 py-2 rounded-lg ${
            darkMode ? "bg-fuchsia-950/40" : "bg-pink-50"
          }`}
        >
          <span className="font-medium">{mod.title}</span>
          <span className="text-sm text-pink-500">
            {(localLessons[mod.id]?.length || 0)} {t("уроків", "уроков")}
          </span>
        </li>
      ))}
    </ul>
  )}
</div>

          {/* 💅 Етап майстерності */}
          <div
            className={`relative p-6 rounded-2xl border shadow-md overflow-hidden transition-all duration-700 bg-gradient-to-br ${stageColor}`}
          >
            {/* кнопка інформації */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/30 transition z-20"
              title={t("Як підвищити майстерність", "Как развивать мастерство")}
            >
              {showInfo ? (
                <X className="w-5 h-5 text-yellow-500" />
              ) : (
                <Info className="w-5 h-5 text-pink-600" />
              )}
            </button>

            {/* контент */}
            <div
              className={`transition-all duration-700 ${
                showInfo ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                {t("Моя майстерність", "Моё мастерство")}
              </h3>

              <div className="text-center">
                <p className="text-5xl font-extrabold mb-1">
                  {t("Рівень", "Уровень")} {realStage}
                </p>

                <p className="text-sm opacity-80 mb-3">
                  {realSkills} {t("навичок", "навыков")} / {nextStageSkills}{" "}
                  {t("навичок", "навыков")}
                </p>

                <div className="h-2 w-full bg-white/40 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-pink-500 transition-all duration-700"
                    style={{ width: `${progressToNext}%` }}
                  ></div>
                </div>

                <p className="text-xs opacity-70">
                  {t("До наступного рівня залишилось", "До следующего уровня осталось")}{" "}
                  {100 - (realSkills % 100)} {t("навичок", "навыков")}
                </p>
              </div>
            </div>

            {/* інфо-вікно */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-center p-8 transition-all duration-700 ${
                showInfo ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="absolute inset-0 rounded-2xl bg-white/70 backdrop-blur-md border border-white/40"></div>
              <div className="relative z-10 animate-fade-in text-center">
                <h3 className="text-2xl font-bold mb-3 text-pink-600">
                  {t("Як розвивати майстерність", "Как развивать мастерство")}
                </h3>
                <p className="text-sm md:text-base font-medium leading-relaxed max-w-md mx-auto mb-5 text-gray-700">
                  {t(
                    "Проходьте уроки, щоб розвивати свої навички. Кожен завершений урок додає 20 одиниць майстерності. Кожні 100 - новий рівень! Виконуйте домашні завдання - отримуйте бонусні 10 одиниць майстерності.",
                    "Проходите уроки, чтобы развивать навыки. За каждый урок начисляется 20 единиц мастерства. Каждые 100 - новый уровень! Выполняйте домашние задания - бонус 10 единиц мастерства."
                  )}
                </p>
              </div>
            </div>
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

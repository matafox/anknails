// src/pages/ModulesPage.jsx
import { useEffect, useState } from "react";
import { BookOpen, ChevronLeft, ChevronDown, ChevronUp, PlayCircle } from "lucide-react";

const BACKEND = "https://anknails-backend-production.up.railway.app";

export default function ModulesPage({ modules, darkMode, t, onBack, onOpenLesson, progress = {} }) {
  const [expanded, setExpanded] = useState(null);
  const [lessonsMap, setLessonsMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  // 🎨 Прості, «чисті» градієнти однієї палітри
  const GRADIENTS_LIGHT = [
    "from-pink-200 to-pink-50",
    "from-violet-200 to-violet-50",
    "from-amber-200 to-amber-50",
    "from-emerald-200 to-emerald-50",
    "from-sky-200 to-sky-50",
  ];
  const BORDERS_LIGHT = [
    "border-pink-300",
    "border-violet-300",
    "border-amber-300",
    "border-emerald-300",
    "border-sky-300",
  ];
  const GRADIENTS_DARK = [
    "from-[#1e0b2a] to-[#14051d]",   // фуксія
    "from-[#170f2e] to-[#0f0a22]",   // фіолет
    "from-[#2b1a08] to-[#1c1106]",   // бурштин
    "from-[#0f2a20] to-[#0a1d16]",   // смарагд
    "from-[#0b1f2b] to-[#071521]",   // синій
  ];
  const BORDERS_DARK = [
    "border-fuchsia-800/40",
    "border-violet-800/40",
    "border-amber-800/40",
    "border-emerald-800/40",
    "border-sky-800/40",
  ];

  const getGrad = (i) =>
    darkMode
      ? `bg-gradient-to-br ${GRADIENTS_DARK[i % GRADIENTS_DARK.length]} ${BORDERS_DARK[i % BORDERS_DARK.length]}`
      : `bg-gradient-to-br ${GRADIENTS_LIGHT[i % GRADIENTS_LIGHT.length]} ${BORDERS_LIGHT[i % BORDERS_LIGHT.length]}`;

  const fetchLessons = async (moduleId) => {
    if (lessonsMap[moduleId] || loadingMap[moduleId]) return;
    setLoadingMap((m) => ({ ...m, [moduleId]: true }));
    try {
      const r = await fetch(`${BACKEND}/api/lessons/${moduleId}`);
      const j = await r.json();
      setLessonsMap((m) => ({ ...m, [moduleId]: j.lessons || [] }));
    } catch (e) {
      console.warn("Lessons fetch failed", e);
      setLessonsMap((m) => ({ ...m, [moduleId]: [] }));
    } finally {
      setLoadingMap((m) => ({ ...m, [moduleId]: false }));
    }
  };

  const toggleModule = async (id) => {
    setExpanded((prev) => (prev === id ? null : id));
    if (!lessonsMap[id]) await fetchLessons(id);
  };

  const openLesson = (lesson) => {
    if (onOpenLesson) {
      onOpenLesson(lesson);
      return;
    }
    try {
      localStorage.setItem("last_lesson", JSON.stringify(lesson));
      localStorage.setItem("last_view", "lesson");
    } catch {}
    window.location.reload();
  };

  // % прогресу
  const getPercent = (l) => {
    const p = progress[l.id];
    if (!p) return 0;
    if (p.completed) return 100;
    const total = Number(p.total_seconds || 0);
    const watched = Number(p.watched_seconds || 0);
    if (total <= 0 || watched <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((watched / total) * 100)));
  };

  return (
    <div
      className={`min-h-screen p-6 md:p-10 transition-colors ${
        darkMode
          ? "bg-gradient-to-br from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* 🔙 Назад (ліворуч) + Заголовок справа в одному рядку */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-pink-500 hover:text-rose-500 transition font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            {t("Назад до дашборду", "Назад на главную")}
          </button>

          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent text-right">
            {t("Мої модулі", "Мои модули")}
          </h1>
        </div>

        {/* 📋 Список модулів */}
        {modules.length === 0 ? (
          <p className="text-center opacity-70 text-sm">
            {t("Модулів поки що немає", "Модулей пока нет")}
          </p>
        ) : (
          <div className="space-y-5">
            {modules.map((mod, i) => {
              const isOpen = expanded === mod.id;
              const lessons = lessonsMap[mod.id] || [];

              return (
                <div
                  key={mod.id}
                  className={`p-5 rounded-2xl border transition ${getGrad(i)} ${
                    darkMode ? "shadow-none" : "shadow-sm"
                  }`}
                >
                  {/* Шапка модуля — максимально просто */}
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="w-full text-left flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${darkMode ? "bg-black/20" : "bg-white/60"}`}>
                        <BookOpen className="w-5 h-5 text-pink-700" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">{mod.title}</h2>
                        <p className="text-xs opacity-80">
                          {(mod.lessons || 0)} {t("уроків", "уроков")}
                        </p>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                  {/* Список уроків — мінімалістичні картки */}
                  {isOpen && (
                    <div className={`mt-4 pt-3 ${darkMode ? "border-t border-white/10" : "border-t border-black/10"}`}>
                      {loadingMap[mod.id] ? (
                        <div className="text-sm opacity-80">
                          {t("Завантаження уроків...", "Загрузка уроков...")}
                        </div>
                      ) : lessons.length === 0 ? (
                        <div className="text-sm opacity-80">
                          {t("У цьому модулі поки немає уроків", "В этом модуле пока нет уроков")}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          {lessons.map((l) => {
                            const percent = getPercent(l);
                            const done = percent === 100;
                            return (
                              <button
                                key={l.id}
                                onClick={() => openLesson(l)}
                                className={`text-left rounded-xl p-0 hover:opacity-95 transition`}
                              >
                                {/* Заголовок уроку в один рядок */}
                                <div className="flex items-center gap-2 mb-2">
                                  <PlayCircle className="w-4 h-4 text-pink-600 shrink-0" />
                                  <div className="font-medium truncate">{l.title}</div>
                                </div>

                                {/* Прогрес — простий */}
                                <div className="flex items-center justify-between text-[11px] mb-1">
                                  <span className={`${done ? "text-emerald-600" : "text-pink-700"} font-medium`}>
                                    {done ? t("Завершено", "Завершено") : t("Прогрес", "Прогресс")}
                                  </span>
                                  <span className={`${done ? "text-emerald-600" : "text-pink-700"} font-semibold`}>
                                    {percent}%
                                  </span>
                                </div>
                                <div className={`${darkMode ? "bg-white/10" : "bg-pink-100"} h-2 rounded-full overflow-hidden`}>
                                  <div
                                    className={`h-full ${done ? "bg-emerald-400" : "bg-pink-500"} transition-all`}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>

                                {/* Тип уроку — дрібний підпис */}
                                {l.type && (
                                  <div className="mt-2 text-[11px] opacity-70">
                                    {l.type === "theory" ? t("Теорія", "Теория") : t("Практика", "Практика")}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

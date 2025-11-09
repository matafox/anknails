// src/pages/ModulesPage.jsx
import { useEffect, useState } from "react";
import { BookOpen, ChevronLeft, ChevronDown, ChevronUp, PlayCircle } from "lucide-react";

const BACKEND = "https://anknails-backend-production.up.railway.app";

export default function ModulesPage({ modules, darkMode, t, onBack, onOpenLesson, progress = {} }) {
  const [expanded, setExpanded] = useState(null);
  const [lessonsMap, setLessonsMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  // 🎨 Градієнти для модулів
  const GRADIENTS_LIGHT = [
    "from-pink-100 via-rose-100 to-amber-100",
    "from-rose-100 via-orange-100 to-pink-100",
    "from-fuchsia-100 via-pink-100 to-rose-100",
    "from-amber-100 via-pink-100 to-rose-100",
    "from-teal-100 via-emerald-100 to-amber-100",
  ];
  const BORDERS_LIGHT = [
    "border-pink-200",
    "border-rose-200",
    "border-fuchsia-200",
    "border-amber-200",
    "border-emerald-200",
  ];
  const GRADIENTS_DARK = [
    "from-[#190026] via-[#260a30] to-[#190026]",
    "from-[#1f0a20] via-[#2a1028] to-[#1f0a20]",
    "from-[#12001c] via-[#200a2a] to-[#12001c]",
    "from-[#1f0a14] via-[#2b0f1c] to-[#1f0a14]",
    "from-[#0d1b1b] via-[#102422] to-[#0d1b1b]",
  ];
  const BORDERS_DARK = [
    "border-fuchsia-900/40",
    "border-rose-900/40",
    "border-purple-900/40",
    "border-amber-900/40",
    "border-emerald-900/40",
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

  // утиліта для відсотків прогресу
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
        {/* 🔙 Назад + Заголовок в ОДНОМУ рядку зліва */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-pink-500 hover:text-rose-500 transition font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            {t("Назад до дашборду", "Назад на главную")}
          </button>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            {t("Мої модулі", "Мои модули")}
          </h1>
        </div>

        {/* 📋 Список модулів */}
        {modules.length === 0 ? (
          <p className="text-center opacity-70 text-sm">
            {t("Модулів поки що немає", "Модулей пока нет")}
          </p>
        ) : (
          <div className="space-y-6">
            {modules.map((mod, i) => {
              const isOpen = expanded === mod.id;
              const lessons = lessonsMap[mod.id] || [];

              return (
                <div
                  key={mod.id}
                  className={`relative p-6 rounded-2xl shadow-lg border overflow-hidden transition transform hover:scale-[1.01] ${getGrad(
                    i
                  )}`}
                >
                  {/* декоративний косий відблиск */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-30
                               bg-gradient-to-br from-white/30 to-transparent"
                  />

                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="w-full text-left flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-xl shadow
                          ${darkMode ? "bg-[#14001d]/60 ring-1 ring-fuchsia-800/40" : "bg-white/70 ring-1 ring-white/60"}`}
                      >
                        <BookOpen className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{mod.title}</h2>
                        {mod.description && (
                          <p className={`text-sm opacity-80 leading-relaxed ${darkMode ? "text-fuchsia-100/80" : "text-gray-700"}`}>
                            {mod.description}
                          </p>
                        )}
                        <p className="mt-1 text-xs font-medium text-pink-700/80">
                          {(mod.lessons || 0)} {t("уроків", "уроков")}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full
                        ${darkMode ? "bg-[#14001d]/60 ring-1 ring-fuchsia-800/40" : "bg-white/70 ring-1 ring-white/60"}`}
                    >
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Список уроків */}
                  {isOpen && (
                    <div
                      className={`mt-4 border-t pt-4 ${
                        darkMode ? "border-fuchsia-900/40" : "border-white/60"
                      }`}
                    >
                      {loadingMap[mod.id] ? (
                        <div className="text-sm opacity-80">
                          {t("Завантаження уроків...", "Загрузка уроков...")}
                        </div>
                      ) : lessons.length === 0 ? (
                        <div className="text-sm opacity-80">
                          {t("У цьому модулі поки немає уроків", "В этом модуле пока нет уроков")}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {lessons.map((l) => {
                            const percent = getPercent(l);
                            const done = percent === 100;
                            return (
                              <button
                                key={l.id}
                                onClick={() => openLesson(l)}
                                className={`group text-left p-3 rounded-xl border transition
                                  ${darkMode
                                    ? "bg-[#15001f]/50 border-fuchsia-900/40 hover:border-pink-500/40 hover:bg-[#1a0526]/60"
                                    : "bg-white/70 border-pink-100 hover:border-pink-300 hover:bg-white"}`}
                              >
                                <div className="flex items-start gap-2">
                                  <div
                                    className={`mt-0.5 flex items-center justify-center w-8 h-8 rounded-md
                                      ${darkMode ? "bg-[#1f0a2a]" : "bg-pink-50"}`}
                                  >
                                    <PlayCircle className="w-4 h-4 text-pink-600" />
                                  </div>
                                  <div className="min-w-0 w-full">
                                    <div className="font-semibold truncate">{l.title}</div>

                                    {/* бейдж типу уроку */}
                                    {l.type && (
                                      <div className="mt-0.5">
                                        {l.type === "theory" && (
                                          <span className="inline-flex items-center text-[11px] px-2 py-[2px] rounded-full border
                                            border-pink-200 bg-pink-50 text-pink-600">
                                            {t("Теорія", "Теория")}
                                          </span>
                                        )}
                                        {l.type === "practice" && (
                                          <span className="inline-flex items-center text-[11px] px-2 py-[2px] rounded-full border
                                            border-rose-200 bg-rose-50 text-rose-600">
                                            {t("Практика", "Практика")}
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {/* прогрес під уроком */}
                                    <div className="mt-2">
                                      <div className="flex items-center justify-between text-[11px] mb-1">
                                        <span className={`${done ? "text-emerald-600" : "text-pink-600"} font-medium`}>
                                          {done ? t("Завершено", "Завершено") : t("Прогрес", "Прогресс")}
                                        </span>
                                        <span className={`${done ? "text-emerald-600" : "text-pink-600"} font-semibold`}>
                                          {percent}%
                                        </span>
                                      </div>
                                      <div className={`${darkMode ? "bg-fuchsia-950/50" : "bg-pink-100"} h-1.5 rounded-full overflow-hidden`}>
                                        <div
                                          className={`h-full transition-all duration-700 ease-out ${
                                            done ? "bg-emerald-400" : "bg-gradient-to-r from-pink-400 to-rose-500"
                                          }`}
                                          style={{ width: `${percent}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
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

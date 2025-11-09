// src/pages/ModulesPage.jsx
import { useEffect, useState } from "react";
import { BookOpen, ChevronLeft, ChevronDown, ChevronUp, PlayCircle } from "lucide-react";

const BACKEND = "https://anknails-backend-production.up.railway.app";

export default function ModulesPage({ modules, darkMode, t, onBack, onOpenLesson, progress = {} }) {
  const [expanded, setExpanded] = useState(null);
  const [lessonsMap, setLessonsMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  // 🎨 Світлі градієнти: більше білого
  const GRADIENTS_LIGHT = [
    "from-white via-white to-pink-50",
    "from-white via-white to-violet-50",
    "from-white via-white to-amber-50",
    "from-white via-white to-emerald-50",
    "from-white via-white to-sky-50",
  ];
  const BORDERS_LIGHT = [
    "border-pink-200/60",
    "border-violet-200/60",
    "border-amber-200/60",
    "border-emerald-200/60",
    "border-sky-200/60",
  ];

  // 🌚 Темні делікатні
  const GRADIENTS_DARK = [
    "from-[#12081a] via-[#12081a] to-[#190a22]",
    "from-[#0f0a18] via-[#0f0a18] to-[#17112a]",
    "from-[#130f08] via-[#130f08] to-[#1b150c]",
    "from-[#0b1612] via-[#0b1612] to-[#10201a]",
    "from-[#0a1218] via-[#0a1218] to-[#0f1b24]",
  ];
  const BORDERS_DARK = ["border-white/10", "border-white/10", "border-white/10", "border-white/10", "border-white/10"];

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
    if (onOpenLesson) return onOpenLesson(lesson);
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
      className={`min-h-screen flex flex-col transition-colors ${
        darkMode
          ? "bg-gradient-to-br from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      {/* Контент (додаємо нижній відступ під «липкий» футер) */}
      <div className="flex-1 p-6 md:p-10 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* 🔙 Назад зліва + Заголовок справа в одному рядку */}
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
                    className={`p-5 rounded-2xl border ${getGrad(i)} ${
                      darkMode ? "shadow-none" : "shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                    }`}
                  >
                    {/* Шапка модуля */}
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full text-left flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            darkMode ? "bg-white/5" : "bg-white"
                          }`}
                        >
                          <BookOpen className="w-5 h-5 text-pink-700" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold">{mod.title}</h2>
                          <p className="text-xs opacity-70">
                            {(mod.lessons || 0)} {t("уроків", "уроков")}
                          </p>
                        </div>
                      </div>
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {/* Список уроків — максимально світлий і простий */}
                    {isOpen && (
                      <div className={`mt-4 pt-3 ${darkMode ? "border-t border-white/10" : "border-t border-black/5"}`}>
                        {loadingMap[mod.id] ? (
                          <div className="text-sm opacity-70">
                            {t("Завантаження уроків...", "Загрузка уроков...")}
                          </div>
                        ) : lessons.length === 0 ? (
                          <div className="text-sm opacity-70">
                            {t("У цьому модулі поки немає уроків", "В этом модуле пока нет уроков")}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            {lessons.map((l) => {
                              const percent = getPercent(l);
                              const done = percent === 100;
                              return (
                                <button
                                  key={l.id}
                                  onClick={() => openLesson(l)}
                                  className={`text-left rounded-xl transition focus:outline-none focus:ring-2 focus:ring-pink-300/60 ${
                                    darkMode ? "bg-white/5 hover:bg-white/10" : "bg-white hover:bg-white"
                                  } p-0`}
                                >
                                  {/* Заголовок уроку */}
                                  <div className="flex items-center gap-2 mb-2">
                                    <PlayCircle className="w-4 h-4 text-pink-600 shrink-0" />
                                    <div className="font-medium truncate">{l.title}</div>
                                  </div>

                                  {/* Прогрес */}
                                  <div className="flex items-center justify-between text-[11px] mb-1">
                                    <span className={`${done ? "text-emerald-600" : "text-pink-700"} font-medium`}>
                                      {done ? t("Завершено", "Завершено") : t("Прогрес", "Прогресс")}
                                    </span>
                                    <span className={`${done ? "text-emerald-600" : "text-pink-700"} font-semibold`}>
                                      {percent}%
                                    </span>
                                  </div>
                                  <div className={`${darkMode ? "bg-white/10" : "bg-pink-100"} h-[6px] rounded-full overflow-hidden`}>
                                    <div
                                      className={`h-full ${done ? "bg-emerald-400" : "bg-pink-500"} transition-all`}
                                      style={{ width: `${percent}%` }}
                                    />
                                  </div>

                                  {/* Тип уроку */}
                                  {l.type && (
                                    <div className="mt-2 text-[11px] opacity-60">
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

      {/* ===== Липкий футер (у межах скрол-контейнера main) ===== */}
      <footer
        className={`sticky bottom-0 z-10 px-6 md:px-10 py-5 text-sm border-t backdrop-blur supports-[backdrop-filter]:bg-white/70
          ${darkMode
            ? "border-fuchsia-900/30 bg-[#12081a]/70 text-fuchsia-100/80"
            : "border-pink-200 bg-white/80 text-gray-600"}`}
      >
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-medium">
            © {new Date().getFullYear()} <span className="text-pink-500 font-semibold">ANK Studio LMS</span> •{" "}
            {t("Усі права захищені.", "Все права защищены.")}
          </p>
        </div>
      </footer>
    </div>
  );
}

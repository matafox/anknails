import { useEffect, useState } from "react";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LessonsPage() {
  const { t } = useTranslation();
  const [lessons, setLessons] = useState([]);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    // ⬇️ Тимчасово фейкові дані, заміниш на fetch("/api/lessons")
    setLessons([
      {
        id: 1,
        title: "Основи манікюру",
        description: "Вступ до курсу та матеріали.",
        duration: "12 хв",
        module: "Модуль 1",
        videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
      },
      {
        id: 2,
        title: "Підготовка нігтьової пластини",
        description: "Правильна підготовка до покриття.",
        duration: "18 хв",
        module: "Модуль 1",
        videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
      },
    ]);
  }, []);

  const toggleComplete = (id) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen px-6 py-16 bg-gradient-to-b from-fuchsia-50 via-white to-rose-50 dark:from-[#100d16] dark:to-[#1a0f1f] text-gray-900 dark:text-white">
      <h1 className="text-4xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400">
        {t("my_lessons", "Мої уроки")}
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="p-5 rounded-2xl border bg-white/70 dark:bg-white/10 border-pink-100 dark:border-pink-500/20 backdrop-blur-md shadow-lg hover:shadow-pink-200/40 dark:hover:shadow-pink-800/30 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">{lesson.title}</h2>
              <button
                onClick={() => toggleComplete(lesson.id)}
                className="text-sm flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow hover:scale-105 transition"
              >
                {completed.includes(lesson.id) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    {t("completed", "Пройдено")}
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    {t("start_lesson", "Дивитись")}
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {lesson.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {lesson.module} • {lesson.duration}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

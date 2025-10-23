import { ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LessonDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // ⬇️ Тимчасово фейковий запит
    setLesson({
      id,
      title: "Основи манікюру",
      description:
        "Цей урок познайомить вас із базовими поняттями манікюру та матеріалами.",
      videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    });
  }, [id]);

  if (!lesson) return null;

  return (
    <div className="min-h-screen p-6 sm:p-10 bg-gradient-to-b from-fuchsia-50 via-white to-rose-50 dark:from-[#100d16] dark:to-[#1a0f1f] text-gray-900 dark:text-white">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm mb-6 text-pink-500 hover:text-rose-500"
      >
        <ArrowLeft className="w-4 h-4" /> {t("back", "Назад")}
      </button>

      <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400">
        {lesson.title}
      </h1>

      <div className="aspect-video mb-6 rounded-2xl overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full"
          src={lesson.videoUrl}
          title={lesson.title}
          allowFullScreen
        ></iframe>
      </div>

      <p className="text-base text-gray-700 dark:text-gray-300 mb-8">
        {lesson.description}
      </p>

      <button
        onClick={() => setCompleted(true)}
        className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white transition-all ${
          completed
            ? "bg-gradient-to-r from-emerald-500 to-green-500"
            : "bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-[1.02]"
        }`}
      >
        {completed ? (
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> {t("lesson_done", "Урок завершено")}
          </span>
        ) : (
          t("mark_done", "Позначити як пройдений")
        )}
      </button>
    </div>
  );
}

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function StudentsWorksCarousel() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const images = [
    "/photos/work1.jpg",
    "/photos/work2.jpg",
    "/photos/work3.jpg",
    "/photos/work4.jpg",
  ];

  // автоматична прокрутка
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const prev = () => setCurrent((current - 1 + images.length) % images.length);
  const next = () => setCurrent((current + 1) % images.length);

  return (
    <section className="relative w-full py-20 flex flex-col items-center overflow-hidden">
      {/* Фонове світіння */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-pink-50 via-white to-rose-50 dark:from-[#1a1a1a] dark:to-[#0f0f0f]" />

      {/* Заголовок */}
      <h2 className="text-4xl font-extrabold text-pink-600 dark:text-pink-400 mb-12 text-center flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
        {t("students_works_title", "Роботи наших учениць")}
      </h2>

      {/* Вертикальна карусель */}
      <div className="relative h-[80vh] w-full max-w-[500px] flex flex-col items-center justify-center">
        {/* Фото */}
        <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl border border-pink-100 dark:border-neutral-800">
          <img
            key={current}
            src={images[current]}
            alt={`Робота учениці ${current + 1}`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 blur-sm animate-fadeIn"
          />
        </div>

        {/* Кнопки */}
        <button
          onClick={prev}
          className="absolute top-4 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md rounded-full p-3 hover:scale-110 transition-all shadow-md"
        >
          <ChevronUp className="w-6 h-6 text-pink-600 dark:text-pink-300" />
        </button>
        <button
          onClick={next}
          className="absolute bottom-4 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md rounded-full p-3 hover:scale-110 transition-all shadow-md"
        >
          <ChevronDown className="w-6 h-6 text-pink-600 dark:text-pink-300" />
        </button>
      </div>

      {/* Індикатори */}
      <div className="flex flex-col gap-2 mt-6">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              i === current
                ? "bg-pink-500 scale-110"
                : "bg-pink-300/50 hover:bg-pink-400/70"
            }`}
          ></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(1.05);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

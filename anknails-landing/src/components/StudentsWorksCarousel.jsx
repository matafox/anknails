import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function StudentsWorksCarousel() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  // 💡 Сюди встав свої зображення робіт учениць
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

  const prev = () =>
    setCurrent((current - 1 + images.length) % images.length);
  const next = () =>
    setCurrent((current + 1) % images.length);

  return (
    <section className="relative w-full py-24 flex flex-col items-center overflow-hidden">
      {/* фонове світіння */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-pink-50 via-white to-rose-50 dark:from-[#1a1a1a] dark:to-[#0f0f0f]"></div>

      <h2 className="text-4xl font-extrabold text-pink-600 dark:text-pink-400 mb-12 text-center flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
        {t("students_works_title", "Роботи наших учениць")}
      </h2>

      <div className="relative w-full max-w-5xl">
        {/* Зображення */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-pink-100 dark:border-neutral-800">
          <img
            src={images[current]}
            alt={`Робота учениці ${current + 1}`}
            className="w-full h-full object-cover transition-all duration-700 ease-in-out"
            key={current}
          />
        </div>

        {/* Кнопки */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 dark:bg-neutral-900/60 backdrop-blur-md rounded-full p-3 hover:scale-110 transition-all shadow-md"
        >
          <ChevronLeft className="w-6 h-6 text-pink-600 dark:text-pink-300" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 dark:bg-neutral-900/60 backdrop-blur-md rounded-full p-3 hover:scale-110 transition-all shadow-md"
        >
          <ChevronRight className="w-6 h-6 text-pink-600 dark:text-pink-300" />
        </button>
      </div>

      {/* Індикатори */}
      <div className="flex gap-2 mt-6">
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
    </section>
  );
}

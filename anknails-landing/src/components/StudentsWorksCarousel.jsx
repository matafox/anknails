import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function StudentsWorksCarousel() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  // 🩶 Фото робіт учениць
  const images = [
    "/photos/work1.jpg",
    "/photos/work2.jpg",
    "/photos/work3.jpg",
    "/photos/work4.jpg",
  ];

  // автоперемикання
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  // попереднє завантаження наступного фото
  useEffect(() => {
    const nextImage = new Image();
    nextImage.src = images[(current + 1) % images.length];
  }, [current]);

  const prev = () => setCurrent((current - 1 + images.length) % images.length);
  const next = () => setCurrent((current + 1) % images.length);

  return (
    <section className="relative w-full py-20 flex flex-col items-center overflow-hidden">
      {/* Заголовок */}
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-12 text-center flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
        {t("students_works_title", "Роботи наших учениць")}
      </h2>

      {/* Вертикальна карусель */}
      <div className="relative h-[80vh] w-full max-w-[500px] flex flex-col items-center justify-center">
        <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl border border-white/20 dark:border-neutral-800">
          <img
            key={current}
            src={images[current]}
            loading="lazy" // 🩵 Ліниве завантаження
            alt={`Робота учениці ${current + 1}`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 animate-fadeIn"
            draggable={false}
          />
        </div>

        {/* Кнопки */}
        <button
          onClick={prev}
          className="absolute top-4 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md rounded-full p-3 hover:scale-110 transition-all shadow-md"
          aria-label="Попереднє фото"
        >
          <ChevronUp className="w-6 h-6 text-gray-700 dark:text-pink-300" />
        </button>

        <button
          onClick={next}
          className="absolute bottom-4 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md rounded-full p-3 hover:scale-110 transition-all shadow-md"
          aria-label="Наступне фото"
        >
          <ChevronDown className="w-6 h-6 text-gray-700 dark:text-pink-300" />
        </button>
      </div>

      {/* Анімація */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(1.03);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

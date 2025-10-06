import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function StudentsWorksCarousel() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  const images = [
    "/photos/work1.jpg",
    "/photos/work2.jpg",
    "/photos/work3.jpg",
    "/photos/work4.jpg",
  ];

  // автоперемикання
  useEffect(() => {
    const timer = setInterval(() => handleNext(), 5000);
    return () => clearInterval(timer);
  }, [current]);

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
      setFade(true);
    }, 300);
  };

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + images.length) % images.length);
      setFade(true);
    }, 300);
  };

  return (
    <section className="relative w-full py-20 flex flex-col items-center overflow-hidden">
      {/* Заголовок */}
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-12 text-center flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
        {t("students_works_title", "Роботи наших учениць")}
      </h2>

      {/* Контейнер */}
      <div className="relative h-[70vh] w-full max-w-[500px] flex flex-col items-center justify-center">
        <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl border border-white/20 dark:border-neutral-800">
          <img
            key={current}
            src={images[current]}
            alt={`Робота учениці ${current + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
              fade ? "opacity-100" : "opacity-0"
            }`}
            draggable={false}
          />
        </div>

        {/* Кнопки */}
        <button
          onClick={handlePrev}
          className="absolute top-4 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md rounded-full p-3 hover:scale-110 transition-all shadow-md z-10"
          aria-label="Попереднє фото"
        >
          <ChevronUp className="w-6 h-6 text-gray-700 dark:text-pink-300" />
        </button>

        <button
          onClick={handleNext}
          className="absolute bottom-4 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md rounded-full p-3 hover:scale-110 transition-all shadow-md z-10"
          aria-label="Наступне фото"
        >
          <ChevronDown className="w-6 h-6 text-gray-700 dark:text-pink-300" />
        </button>
      </div>
    </section>
  );
}

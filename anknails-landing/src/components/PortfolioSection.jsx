import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PortfolioSection() {
  const { t } = useTranslation();
  const [images, setImages] = useState([
    "/portfolio1.jpg",
    "/portfolio2.jpg",
    "/portfolio3.jpg"
  ]);

  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages].slice(0, 3)); // тільки 3 фото максимум
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
        {t("portfolio_title")}
      </h2>

      {/* === GRID 3 фото + кнопка === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square overflow-hidden rounded-2xl bg-white/60 dark:bg-white/10 border border-pink-100 dark:border-neutral-700 shadow-lg backdrop-blur-md"
          >
            <img
              src={src}
              alt={`portfolio-${i}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}

        {/* Додати фото */}
        <label className="flex flex-col items-center justify-center aspect-square cursor-pointer rounded-2xl border-2 border-dashed border-pink-300 dark:border-pink-700 hover:bg-pink-50/50 dark:hover:bg-white/5 transition-colors">
          <Plus className="w-10 h-10 text-pink-500 mb-2" />
          <span className="text-sm text-pink-500 font-medium">
            {t("portfolio_add")}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddPhoto}
            className="hidden"
          />
        </label>
      </div>

      {/* === Блок До / Після === */}
      <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-pink-100 dark:border-neutral-700 bg-white/60 dark:bg-white/10 backdrop-blur-md">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/before.jpg"
            alt="before"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 overflow-hidden" id="after-mask">
            <img
              src="/after.jpg"
              alt="after"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                clipPath: "inset(0 50% 0 0)" // спочатку половина
              }}
            />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="50"
          onChange={(e) => {
            const afterMask = document.getElementById("after-mask");
            if (afterMask) {
              afterMask.firstChild.style.clipPath = `inset(0 ${100 - e.target.value}% 0 0)`;
            }
          }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 accent-pink-500 cursor-pointer"
        />
      </div>
    </section>
  );
}

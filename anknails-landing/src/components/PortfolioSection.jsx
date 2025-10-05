import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function PortfolioSection() {
  const { t } = useTranslation();
  const [sliderValue, setSliderValue] = useState(50);

  const images = [
    "/portfolio1.jpg",
    "/portfolio2.jpg",
    "/portfolio3.jpg"
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
        {t("portfolio_title")}
      </h2>

      {/* GRID із трьох фото */}
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
      </div>

      {/* ДО / ПІСЛЯ блок */}
      <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-pink-100 dark:border-neutral-700 bg-white/60 dark:bg-white/10 backdrop-blur-md">
        {/* before / after images */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/before.jpg"
            alt="before"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath: `inset(0 ${100 - sliderValue}% 0 0)`
            }}
          >
            <img
              src="/after.jpg"
              alt="after"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* вертикальна лінія межі */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-pink-400/80 shadow-[0_0_8px_#ec4899] transition-all duration-100"
          style={{
            left: `${sliderValue}%`,
            transform: "translateX(-50%)"
          }}
        />

        {/* повзунок */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          className="absolute top-1/2 left-0 -translate-y-1/2 w-full accent-pink-500 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(to right, #ec4899 ${sliderValue}%, #e5e7eb ${sliderValue}%)`
          }}
        />
      </div>
    </section>
  );
}

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
    setImages((prev) => [...prev, ...newImages]);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
        {t("portfolio_title")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </section>
  );
}

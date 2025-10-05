import { useTranslation } from "react-i18next";

export default function PortfolioSection() {
  const { t } = useTranslation();

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
      </div>
    </section>
  );
}

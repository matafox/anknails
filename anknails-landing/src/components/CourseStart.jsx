import React from "react";
import { useTranslation } from "react-i18next";

export default function CourseStart() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full py-20 flex flex-col items-center justify-center overflow-hidden">
      {/* ==== Фон з м’яким розмитим сяйвом ==== */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-100px] left-[-150px] w-[450px] h-[450px] bg-pink-300/30 blur-[140px] rounded-full animate-float-slow"></div>
        <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-rose-400/30 blur-[160px] rounded-full animate-float-fast"></div>
        <div className="absolute top-[200px] right-[100px] w-[250px] h-[250px] bg-fuchsia-400/25 blur-[100px] rounded-full animate-float-mid"></div>
      </div>

      {/* ==== Основний текстовий блок ==== */}
      <div className="rounded-3xl border border-pink-200/50 dark:border-neutral-700 bg-white/50 dark:bg-neutral-900/40 backdrop-blur-2xl shadow-lg p-10 px-8 max-w-4xl text-center animate-fade-up">
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-snug tracking-wide">
          {t("course_starts", "Старт нового потоку вже зовсім скоро!")}
        </p>
      </div>

      {/* ==== Анімації ==== */}
      <style jsx>{`
        @keyframes float-slow {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(25px) scale(1.05); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes float-mid {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-fast {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.8s ease-out both; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-mid { animation: float-mid 10s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 8s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

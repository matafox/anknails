import React from "react";
import { useTranslation } from "react-i18next";

export default function CourseStart() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full py-24 flex flex-col items-center justify-center overflow-hidden">
      {/* ==== Фонове розмите сяйво ==== */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-pink-400/20 blur-[180px] rounded-full animate-float-slow"></div>
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-purple-600/25 blur-[200px] rounded-full animate-float-mid"></div>
        <div className="absolute top-[150px] right-[200px] w-[300px] h-[300px] bg-fuchsia-500/20 blur-[160px] rounded-full animate-float-fast"></div>
      </div>

      {/* ==== Фіолетовий блок без рамки ==== */}
      <div className="relative p-10 sm:p-14 text-center 
                      rounded-[40px] 
                      backdrop-blur-3xl 
                      bg-gradient-to-br from-fuchsia-600/60 via-purple-700/50 to-pink-600/60 
                      shadow-[0_0_60px_rgba(168,85,247,0.4)]
                      animate-fade-up">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 via-fuchsia-400/30 to-purple-400/30 blur-[60px] rounded-[40px] -z-10"></div>

        <p className="text-2xl sm:text-3xl font-bold text-white leading-snug tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
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
        .animate-fade-up { animation: fade-up 0.9s ease-out both; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-mid { animation: float-mid 10s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 8s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

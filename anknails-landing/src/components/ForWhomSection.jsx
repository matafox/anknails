import { CheckCircle2, CalendarClock, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ForWhomSection() {
  const { t } = useTranslation();

  const beginners = [
    t("for_beginners_1"),
    t("for_beginners_2"),
    t("for_beginners_3"),
    t("for_beginners_4"),
    t("for_beginners_5"),
    t("for_beginners_6"),
    t("for_beginners_7"),
    t("for_beginners_8"),
    t("for_beginners_9"),
    t("for_beginners_10"),
  ];

  const experienced = [
    t("for_experienced_1"),
    t("for_experienced_2"),
    t("for_experienced_3"),
    t("for_experienced_4"),
    t("for_experienced_5"),
    t("for_experienced_6"),
    t("for_experienced_7"),
    t("for_experienced_8"),
    t("for_experienced_9"),
    t("for_experienced_10"),
  ];

  const learning = [
    t("learning_1"),
    t("learning_2"),
    t("learning_3"),
    t("learning_4"),
  ];

  return (
    <section className="relative w-full overflow-hidden py-24 flex flex-col items-center">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100/60 via-transparent to-pink-100/60 dark:from-[#1a1a1a]/60 dark:to-[#1a1a1a]/60 backdrop-blur-[100px]"></div>
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-pink-300/30 blur-[160px] rounded-full animate-float-slow"></div>
        <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-fuchsia-400/30 blur-[180px] rounded-full animate-float-fast"></div>
        <div className="absolute top-[200px] right-[200px] w-[300px] h-[300px] bg-rose-400/25 blur-[120px] rounded-full animate-float-mid"></div>
      </div>

      <h2 className="text-4xl font-extrabold text-pink-600 dark:text-pink-400 mb-14 text-center">
        {t("for_whom_title")}
      </h2>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-6 animate-fade-up">
        {/* Майстри з невеликим досвідом */}
        <div className="bg-white/20 dark:bg-white/10 backdrop-blur-2xl border border-pink-200/40 dark:border-neutral-700 rounded-2xl p-8 shadow-lg hover:shadow-pink-300/30 transition-all duration-500 hover:scale-[1.02]">
          <h3 className="text-2xl font-bold mb-6 text-pink-600 dark:text-pink-400 uppercase">
            {t("for_beginners_title")}
          </h3>
          <ul className="space-y-3 text-left text-gray-700 dark:text-gray-300">
            {beginners.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Досвідчені майстри */}
        <div className="bg-white/20 dark:bg-white/10 backdrop-blur-2xl border border-pink-200/40 dark:border-neutral-700 rounded-2xl p-8 shadow-lg hover:shadow-pink-300/30 transition-all duration-500 hover:scale-[1.02]">
          <h3 className="text-2xl font-bold mb-6 text-pink-600 dark:text-pink-400 uppercase">
            {t("for_experienced_title")}
          </h3>
          <ul className="space-y-3 text-left text-gray-700 dark:text-gray-300">
            {experienced.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Як проходить навчання */}
        <div className="md:col-span-2 bg-white/20 dark:bg-white/10 backdrop-blur-2xl border border-pink-200/40 dark:border-neutral-700 rounded-2xl p-8 shadow-lg hover:shadow-pink-300/30 transition-all duration-500 hover:scale-[1.02]">
          <h3 className="text-2xl font-bold mb-6 text-pink-600 dark:text-pink-400 uppercase">
            {t("how_learning_title")}
          </h3>
          <ul className="space-y-3 text-left text-gray-700 dark:text-gray-300">
            {learning.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Тривалість і доступ */}
        <div className="md:col-span-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 backdrop-blur-2xl border border-pink-200/50 dark:border-neutral-700 rounded-2xl p-6 shadow-lg mt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-3 text-pink-700 dark:text-pink-300">
            <CalendarClock className="w-6 h-6" />
            <span className="font-semibold text-lg">{t("course_duration")}</span>
          </div>
          <div className="flex items-center gap-3 text-pink-700 dark:text-pink-300">
            <BookOpen className="w-6 h-6" />
            <span className="font-semibold text-lg">{t("course_access")}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(30px) scale(1.05); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes float-mid {
          0% { transform: translate(0px, 0px); }
          50% { transform: translate(-20px, 25px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes float-fast {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.1); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 1s ease-out both; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-mid { animation: float-mid 9s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 7s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

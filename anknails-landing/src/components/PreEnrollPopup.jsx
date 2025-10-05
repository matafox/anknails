import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PreEnrollPopup({ isOpen, onClose }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm animate-fade-in-fast"
      onClick={onClose}
    >
      <div
        className="relative mt-[5vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl 
                   w-full max-w-3xl mx-4 overflow-hidden border border-pink-100 dark:border-neutral-700 
                   animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b border-pink-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">
            {t("preenroll_title")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-pink-100/50 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Текст */}
        <p className="px-6 pt-4 pb-2 text-gray-600 dark:text-gray-300 text-center">
          {t("preenroll_desc")}
        </p>

        {/* Форма */}
        <iframe
          src="https://forms.gle/rPjtEpgLnz1jBY4R6"
          width="100%"
          height="700"
          className="rounded-b-2xl border-0"
          title={t("preenroll_title")}
        ></iframe>
      </div>

      {/* Анімації */}
      <style jsx>{`
        @keyframes fade-in-fast {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-fast {
          animation: fade-in-fast 0.25s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}

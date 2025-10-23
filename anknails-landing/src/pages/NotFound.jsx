import { useNavigate } from "react-router-dom";
import { Ghost, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const nav = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const texts = {
    uk: {
      title: "404",
      message: "Такої сторінки не існує. Можливо, посилання з помилкою.",
      button: "На головну",
    },
    ru: {
      title: "404",
      message: "Такой страницы не существует. Возможно, ссылка с ошибкой.",
      button: "На главную",
    },
  };

  const t = texts[lang] || texts.uk;

  return (
    <div className="min-h-screen flex items-center justify-center px-6
      bg-gradient-to-b from-[#f6f0ff] via-white to-[#fdf9ff]
      dark:from-[#100d16] dark:via-[#18141f] dark:to-[#100d16]">
      <div className="max-w-lg w-full text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center
          bg-white/60 dark:bg-white/10 border border-pink-200/40 dark:border-pink-600/30 shadow-lg mb-6">
          <Ghost className="w-8 h-8 text-pink-500" />
        </div>

        <h1 className="text-5xl font-extrabold mb-3
          text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400">
          {t.title}
        </h1>

        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          {t.message}
        </p>

        <button
          onClick={() => nav("/")}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl
            bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold
            shadow-md hover:scale-[1.02] active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5" />
          {t.button}
        </button>
      </div>
    </div>
  );
}

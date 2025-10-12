import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BookingMessage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ru" ? "ru" : "uk";

  const text = {
    uk: {
      message: "Хочеш забронювати місце на курс?",
      sub: "Натисни кнопку нижче, щоб написати нам у Telegram!",
      button: "Написати в Telegram",
    },
    ru: {
      message: "Хочешь забронировать место на курс?",
      sub: "Нажми на кнопку ниже, чтобы написать нам в Telegram!",
      button: "Написать в Telegram",
    },
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="max-w-md w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-md p-4 flex items-start gap-3 backdrop-blur-sm">
{/* Іконка Telegram зліва */}
<div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow-inner">
<a href="https://t.me/m/cE5yXCdSZTAy" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-11 h-11 rounded-full bg-pink-100/40 dark:bg-white/10 backdrop-blur-md border border-pink-300 dark:border-white/10 hover:scale-110 transition-transform" > <Send className="w-5 h-5 text-pink-600 dark:text-pink-400 transition-colors duration-300 group-hover:text-[#0088cc]" /> </a>
</div>


        {/* Текстове повідомлення */}
        <div className="flex-1 text-left">
          <p className="text-sm text-gray-800 dark:text-gray-100 leading-snug font-medium">
            {text[lang].message}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {text[lang].sub}
          </p>

          <a
            href="https://t.me/m/cE5yXCdSZTAy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-all duration-300"
          >
            {text[lang].button}
          </a>
        </div>
      </div>
    </div>
  );
}

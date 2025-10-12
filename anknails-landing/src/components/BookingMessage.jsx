import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BookingMessage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ru" ? "ru" : "uk";

  const text = {
    uk: {
      message: "💬 Хочеш забронювати місце на курс?",
      sub: "Натисни кнопку нижче, щоб написати нам у Telegram!",
      button: "Написати в Telegram",
    },
    ru: {
      message: "💬 Хочешь забронировать место на курс?",
      sub: "Нажми на кнопку ниже, чтобы написать нам в Telegram!",
      button: "Написать в Telegram",
    },
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="max-w-md w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-md p-4 flex items-start gap-3 backdrop-blur-sm">
        {/* Іконка зліва */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-inner">
          <MessageCircle className="w-5 h-5" />
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
            {/* Telegram logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 240 240"
              className="w-4 h-4"
              fill="currentColor"
            >
              <circle cx="120" cy="120" r="120" fill="#0088cc" />
              <path
                fill="#fff"
                d="M179 69c2-8-6-8-10-7l-114 44c-7 3-6 7-1 9l28 9c5 1 7 0 10-2l64-40c3-2 5 1 3 3l-51 48c-3 3-3 5-2 8l2 21c0 7 4 9 9 5l21-17 26 19c5 3 9 2 10-5z"
              />
            </svg>

            {text[lang].button}
          </a>
        </div>
      </div>
    </div>
  );
}

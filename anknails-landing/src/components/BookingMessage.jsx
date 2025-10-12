import { MessageCircle } from "lucide-react";

export default function BookingMessage() {
  return (
    <div className="w-full flex justify-center mt-10">
      <div className="max-w-md w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-md p-4 flex items-start gap-3 backdrop-blur-sm">
        {/* Іконка зліва */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-inner">
          <MessageCircle className="w-5 h-5" />
        </div>

        {/* Текстове повідомлення */}
        <div className="flex-1 text-left">
          <p className="text-sm text-gray-800 dark:text-gray-100 leading-snug">
            💬 Хочеш забронювати місце на курс?  
            Натисни кнопку нижче, щоб написати нам у Telegram!
          </p>

          <a
            href="https://t.me/m/cE5yXCdSZTAy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-all duration-300"
          >
            Написати
          </a>
        </div>
      </div>
    </div>
  );
}

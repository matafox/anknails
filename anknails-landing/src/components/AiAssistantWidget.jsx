import { useState } from "react";
import { X, MessageCircle } from "lucide-react";

const DEFAULT_BACKEND = "https://anknails-backend-production.up.railway.app";

// 🔹 Заготовлені питання (оновлені під FAQ)
const SUGGESTED_QUESTIONS = {
  uk: [
    "З чого почати навчання на курсі?",
    "Не можу зайти в кабінет / пише, що немає доступу",
    "Скільки триває доступ до курсу і як його продовжити?",
    "Як повернутися до останнього переглянутого уроку?",
    "Відео не завантажується / немає звуку / чорний екран",
    "Питання по оплаті або тарифу курсу",
    "Де знайти домашнє завдання до уроку?",
    "Де шукати файли, чек-листи та матеріали до уроків?",
    "Коли і як я отримаю сертифікат ANK Studio?",
    "Є технічна проблема з платформою / все лагає",
    "Потрібно змінити email або дані акаунта",
    "Не зберігається прогрес / галочки на уроках",
  ],
  ru: [
    "С чего начать обучение на курсе?",
    "Не могу зайти в кабинет / пишет, что нет доступа",
    "Сколько длится доступ к курсу и как его продлить?",
    "Как вернуться к последнему просмотренному уроку?",
    "Видео не загружается / нет звука / чёрный экран",
    "Вопрос по оплате или тарифу курса",
    "Где найти домашнее задание к уроку?",
    "Где искать файлы, чек-листы и материалы к урокам?",
    "Когда и как я получу сертификат ANK Studio?",
    "Есть техническая проблема с платформой / всё лагает",
    "Нужно сменить email или данные аккаунта",
    "Не сохраняется прогресс / галочки на уроках",
  ],
};

export default function AiAssistantWidget({
  userId,
  lang = "uk",
  backendUrl = DEFAULT_BACKEND,
  darkMode = false, // ⬅️ режим темної/світлої теми
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        lang === "ru"
          ? "Привет! Выбери подходящий вопрос — и я подскажу 😊"
          : "Привіт! Обери питання — і я підкажу 😊",
    },
  ]);

  const isRu = lang === "ru";
  const suggestions = isRu ? SUGGESTED_QUESTIONS.ru : SUGGESTED_QUESTIONS.uk;

  // 🔹 універсальна функція відправки тексту (тільки з готових кнопок)
  const sendMessageWith = async (rawText) => {
    const trimmed = rawText.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setLoading(true);

    try {
      const payload = {
        message: trimmed,
        lang,
      };
      if (userId) {
        payload.user_id = userId;
      }

      const res = await fetch(`${backendUrl}/api/ai-assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let answerText;
      try {
        const data = await res.json();
        answerText =
          data?.answer ||
          (isRu
            ? "Произошла ошибка. Попробуй ещё раз позже 🙏"
            : "Сталася помилка. Спробуй ще раз пізніше 🙏");
      } catch {
        answerText = isRu
          ? "Произошла ошибка при разборе ответа сервера 🙏"
          : "Сталася помилка під час обробки відповіді сервера 🙏";
      }

      setMessages((prev) => [...prev, { from: "bot", text: answerText }]);
    } catch (e) {
      console.error("AI assistant error:", e);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: isRu
            ? "Сервер сейчас недоступен. Попробуй позже 🙏"
            : "Сервер зараз недоступний. Спробуй пізніше 🙏",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Плаваюча кнопка */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-40 rounded-full shadow-lg flex items-center justify-center w-12 h-12
                   bg-gradient-to-tr from-pink-500 to-fuchsia-500 text-white"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Вікно чату */}
      {open && (
        <div
          className={`
            fixed z-40 
            inset-x-0 bottom-0
            md:bottom-20 md:right-4 md:left-auto
            w-full md:w-80
            max-w-full md:max-w-[90vw]
            h-[60vh] md:h-auto
            rounded-t-3xl md:rounded-2xl
            shadow-xl
            backdrop-blur-xl
            flex flex-col overflow-hidden
            ${
              darkMode
                ? "border-fuchsia-800/70 bg-[#050011]/95"
                : "border-pink-200 bg-white/95"
            }
          `}
        >
          {/* Header */}
          <div
            className={`
              flex items-center justify-between px-3 py-2
              ${
                darkMode
                  ? "bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white"
                  : "bg-gradient-to-r from-pink-500 to-rose-400 text-white"
              }
            `}
          >
            <div className="flex flex-col">
              <span className="font-semibold text-sm">
                {isRu ? "Помощник ANK Studio" : "Помічник ANK Studio"}
              </span>
              <span className="text-[11px] opacity-85">
                {isRu
                  ? "Нажми на кнопку с вопросом по кабинету или курсу"
                  : "Натисни на кнопку з питанням по кабінету або курсу"}
              </span>
            </div>
            <button onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 🔹 Популярні питання */}
          <div
            className={`
              px-3 pt-2 pb-1 border-b flex flex-wrap gap-1
              ${
                darkMode
                  ? "border-fuchsia-800/60 bg-[#090018]"
                  : "border-pink-100 bg-pink-50"
              }
            `}
          >
            {suggestions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => sendMessageWith(q)}
                className={`
                  text-[11px] px-2.5 py-1 rounded-full transition
                  ${
                    darkMode
                      ? "border border-fuchsia-700/70 bg-fuchsia-900/40 text-fuchsia-100 hover:bg-fuchsia-800/60"
                      : "border border-pink-200 bg-white text-pink-700 hover:bg-pink-50"
                  }
                `}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Повідомлення (зі скролом) */}
          <div
            className={`
              flex-1 min-h-0 px-3 py-2 space-y-2 overflow-y-auto text-sm
              max-h-[45vh] md:max-h-80
              ${darkMode ? "text-fuchsia-50" : "text-gray-800"}
            `}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    px-3 py-2 rounded-2xl max-w-[85%] text-sm leading-snug
                    ${
                      m.from === "user"
                        ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white rounded-br-sm"
                        : darkMode
                        ? "bg-[#130022] text-fuchsia-100 rounded-bl-sm"
                        : "bg-pink-50 text-pink-900 rounded-bl-sm"
                    }
                  `}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div
                className={`text-xs opacity-60 ${
                  darkMode ? "text-fuchsia-200" : "text-gray-500"
                }`}
              >
                {isRu ? "Помощник пишет..." : "Помічник набирає відповідь..."}
              </div>
            )}
          </div>

          {/* 🔒 Без інпута — тільки готові питання */}
        </div>
      )}
    </>
  );
}

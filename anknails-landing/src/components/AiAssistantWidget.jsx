import { useState } from "react";
import { X, MessageCircle, Send } from "lucide-react";

const DEFAULT_BACKEND = "https://anknails-backend-production.up.railway.app";

// 🔹 Заготовлені питання
const SUGGESTED_QUESTIONS = {
  uk: [
    "Не можу зайти в кабінет, пише що немає доступу",
    "Відео не завантажується / чорний екран",
    "Як продовжити доступ до курсу?",
    "Де знайти домашнє завдання до уроку?",
    "Коли і як я отримаю сертифікат ANK Studio?",
  ],
  ru: [
    "Не могу зайти в кабинет, пишет что нет доступа",
    "Видео не загружается / чёрный экран",
    "Как продлить доступ к курсу?",
    "Где найти домашнее задание к уроку?",
    "Когда и как я получу сертификат ANK Studio?",
  ],
};

export default function AiAssistantWidget({
  userId,
  lang = "uk",
  backendUrl = DEFAULT_BACKEND,
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        lang === "ru"
          ? "Привет! Я ассистент ANK Studio. Задай вопрос по курсу, урокам или доступу 😊"
          : "Привіт! Я асистент ANK Studio. Напиши питання по курсу, урокам або доступу 😊",
    },
  ]);

  const suggestions =
    lang === "ru" ? SUGGESTED_QUESTIONS.ru : SUGGESTED_QUESTIONS.uk;

  // 🔹 універсальна функція відправки тексту (і з інпута, і з кнопок)
  const sendMessageWith = async (rawText) => {
    const trimmed = rawText.trim();
    if (!trimmed || loading) return;

    // додаємо повідомлення юзера
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
          (lang === "ru"
            ? "Произошла ошибка. Попробуй еще раз позже 🙏"
            : "Сталася помилка. Спробуй ще раз пізніше 🙏");
      } catch {
        answerText =
          lang === "ru"
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
          text:
            lang === "ru"
              ? "Сервер сейчас недоступен. Попробуй позже 🙏"
              : "Сервер зараз недоступний. Спробуй пізніше 🙏",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // відправка саме з інпута
  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setInput(""); // чистимо поле
    await sendMessageWith(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
        <div className="fixed bottom-20 right-4 z-40 w-80 max-w-[90vw] rounded-2xl shadow-xl border border-pink-200
                        bg-white/95 backdrop-blur-md flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-pink-500 text-white">
            <div className="flex flex-col">
              <span className="font-semibold text-sm">
                {lang === "ru"
                  ? "AI-помощник ANK Studio"
                  : "AI-помічник ANK Studio"}
              </span>
              <span className="text-[11px] opacity-85">
                {lang === "ru"
                  ? "Отвечаю только по курсу и платформе"
                  : "Відповідаю тільки по курсу та платформі"}
              </span>
            </div>
            <button onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 🔹 Популярні питання */}
          <div className="px-3 pt-2 pb-1 border-b border-pink-100 flex flex-wrap gap-1">
            {suggestions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => sendMessageWith(q)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100 transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Повідомлення */}
          <div className="flex-1 px-3 py-2 space-y-2 overflow-y-auto text-sm max-h-80">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[85%] ${
                    m.from === "user"
                      ? "bg-pink-500 text-white rounded-br-sm"
                      : "bg-pink-100 text-pink-900 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-xs opacity-60">
                {lang === "ru"
                  ? "Ассистент печатает..."
                  : "Помічник набирає відповідь..."}
              </div>
            )}
          </div>

          {/* Інпут */}
          <div className="border-t border-pink-200 flex items-center gap-2 px-2 py-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="flex-1 text-sm resize-none outline-none border border-pink-200 rounded-xl px-2 py-1
                         focus:border-pink-400"
              placeholder={
                lang === "ru"
                  ? "Напиши вопрос по курсу..."
                  : "Напиши питання по курсу..."
              }
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-2 rounded-full bg-pink-500 text-white disabled:opacity-40 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

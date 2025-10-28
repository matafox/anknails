import { useEffect, useState } from "react";
import { X, Clock } from "lucide-react";

export default function PromoPopup({ lang = "uk", onVisibleChange }) {
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const translations = {
  uk: {
    title: "🔥 Акційна пропозиція!",
    text: "Зараз діє знижка на курс. Встигни придбати за акційною ціною до кінця дня!",
    button: "До тарифів",
    endsIn: "Акція закінчиться через",
    labels: { h: "год", m: "хв", s: "сек" },
    expired: "Акцію завершено 💅",
  },
  ru: {
    title: "🔥 Акционное предложение!",
    text: "Сейчас действует скидка на курс. Успей приобрести по акции до конца дня!",
    button: "К тарифам",
    endsIn: "Акция закончится через",
    labels: { h: "ч", m: "мин", s: "сек" },
    expired: "Акция завершена 💅",
  },
};

// 🩷 Безпечний fallback — якщо мова не uk/ru → використовуємо uk
const t = translations[lang] || translations.uk;

  // 🩷 показати через 5 секунд — завжди
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // 🔁 синхронізація зі станом App
  useEffect(() => {
    onVisibleChange?.(visible);
  }, [visible, onVisibleChange]);

  // 🕒 обчислення часу до опівночі
  const updateTimer = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // наступна опівночь
    const diff = Math.max(0, Math.floor((midnight - now) / 1000));
    setTimeLeft(diff);
  };

  // 🔄 оновлюємо таймер щосекунди
  useEffect(() => {
    if (!visible) return;
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  const handleClose = () => setVisible(false);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  const expired = timeLeft <= 0;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div
        className="mx-auto max-w-md rounded-t-3xl shadow-2xl border p-6 relative 
        backdrop-blur-md transition-colors duration-300
        bg-white/80 text-gray-900 border-pink-200/40 
        dark:bg-[#2A0C19]/90 dark:text-white dark:border-pink-500/30"
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-white/70 hover:opacity-80"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-2">
          {t.title}
        </h2>

        <p className="text-sm text-gray-700 dark:text-white/80 mb-4">
          {t.text}
        </p>

        {!expired ? (
          <>
            <div className="flex items-center gap-2 mb-3 text-sm">
              <Clock size={16} className="text-pink-500 dark:text-pink-400" />
              <span className="text-gray-700 dark:text-white/80">
                {t.endsIn}
              </span>
            </div>

            <div className="text-2xl font-mono mb-5 text-pink-600 dark:text-pink-300">
              {hours}{t.labels.h} {minutes}{t.labels.m} {seconds}{t.labels.s}
            </div>
          </>
        ) : (
          <div className="text-lg text-pink-600 dark:text-pink-300 font-semibold mb-4">
            {t.expired}
          </div>
        )}

        <a
          href="#tariffs"
          onClick={handleClose}
          className="block w-full text-center 
          bg-gradient-to-r from-pink-500 to-rose-500 
          font-semibold py-2 rounded-xl text-white 
          hover:opacity-90 transition"
        >
          {t.button}
        </a>
      </div>
    </div>
  );
}

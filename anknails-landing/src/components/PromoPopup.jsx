import { useEffect, useState } from "react";
import { X, Clock } from "lucide-react";

export default function PromoPopup({ lang = "uk", onVisibleChange }) {
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(17 * 3600 + 25 * 60); // 17 год 25 хв

  const t = {
    uk: {
      title: "🔥 Акційна пропозиція!",
      text: "Зараз діє знижка на курс. Встигни придбати за акційною ціною!",
      button: "До тарифів",
      endsIn: "Акція закінчиться через",
    },
    ru: {
      title: "🔥 Акционное предложение!",
      text: "Сейчас действует скидка на курс. Успей приобрести по акции!",
      button: "К тарифам",
      endsIn: "Акция закончится через",
    },
  }[lang];

  // 🩷 показати через 5 секунд — тепер завжди, незалежно від попередніх закриттів
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // 🔁 передаємо стан у App (щоб ховати стрілку)
  useEffect(() => {
    onVisibleChange?.(visible);
  }, [visible, onVisibleChange]);

  // 🕒 таймер
  useEffect(() => {
    if (!visible || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [visible, timeLeft]);

  const handleClose = () => {
    setVisible(false);
  };

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-md bg-[#2A0C19]/90 backdrop-blur-md text-white rounded-t-3xl shadow-2xl border border-pink-500/30 p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-pink-400 mb-2">{t.title}</h2>
        <p className="text-sm text-white/80 mb-4">{t.text}</p>

        <div className="flex items-center gap-2 mb-3 text-sm">
          <Clock size={16} className="text-pink-400" />
          <span className="text-white/80">{t.endsIn}</span>
        </div>

        <div className="text-2xl font-mono mb-5 text-pink-300">
          {hours}h {minutes}m {seconds}s
        </div>

        <a
          href="#tariffs"
          onClick={handleClose}
          className="block w-full text-center bg-gradient-to-r from-pink-500 to-rose-500 font-semibold py-2 rounded-xl hover:opacity-90 transition"
        >
          {t.button}
        </a>
      </div>
    </div>
  );
}

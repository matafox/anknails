import { X, Sparkles, ArrowRightCircle } from "lucide-react";

export default function WelcomeModal({
  open,
  onClose,
  onStart,
  t,
  darkMode,
  user,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div
        className={`relative w-full max-w-md rounded-2xl border shadow-xl overflow-hidden
        ${darkMode
          ? "bg-[#1a0a1f] border-fuchsia-900/40 text-fuchsia-100"
          : "bg-white border-pink-200 text-gray-800"}`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className={`absolute top-3 right-3 p-2 rounded-full transition
          ${darkMode ? "hover:bg-white/10" : "hover:bg-pink-50"}`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center w-9 h-9 rounded-xl
            ${darkMode ? "bg-white/10" : "bg-pink-50"}`}
          >
            <Sparkles className="w-5 h-5 text-pink-500" />
          </span>
          <h3 className="text-xl font-bold">
            {t("Вітаємо в ANK Studio Online!", "Добро пожаловать в ANK Studio Online!")}
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 pb-2 text-sm leading-relaxed">
          <p className={`${darkMode ? "text-fuchsia-100/90" : "text-gray-700"}`}>
            {t(
              "Щоб почати, відкрий розділ «Мої модулі» і пройди перший урок. Прогрес зберігається автоматично.",
              "Чтобы начать, открой раздел «Мои модули» и пройди первый урок. Прогресс сохраняется автоматически."
            )}
          </p>

          {user?.expires_at && (
            <p className={`mt-3 ${darkMode ? "text-fuchsia-100/80" : "text-gray-600"}`}>
              <span className="font-medium">
                {t("Доступ до", "Доступ до")}:
              </span>{" "}
              <span className={`${darkMode ? "text-fuchsia-50" : "text-gray-900"} font-semibold`}>
                {user.expires_at}
              </span>
            </p>
          )}

          <ul className={`mt-4 space-y-2 ${darkMode ? "text-fuchsia-100/85" : "text-gray-700"}`}>
            <li>• {t("Гортай модулі у сайдбарі зліва", "Листай модули в левом сайдбаре")}</li>
            <li>• {t("Кожен завершений урок = +20 навичок", "Каждый завершённый урок = +20 навыков")}</li>
            <li>• {t("Домашнє завдання дає бонус", "Домашнее задание даёт бонус")}</li>
          </ul>
        </div>

        {/* Actions */}
        <div className={`px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end border-t
          ${darkMode ? "border-fuchsia-900/30" : "border-pink-200"}`}>
          <button
            onClick={onClose}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl font-semibold transition
              ${darkMode
                ? "bg-white/10 hover:bg-white/15 text-fuchsia-100"
                : "bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200"}`}
          >
            {t("На дашборд", "На дашборд")}
          </button>
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-[1.02] transition flex items-center justify-center gap-2"
          >
            <ArrowRightCircle className="w-5 h-5" />
            {t("Почати з модулів", "Начать с модулей")}
          </button>
        </div>
      </div>
    </div>
  );
}

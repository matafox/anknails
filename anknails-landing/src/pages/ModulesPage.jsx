import { BookOpen, ChevronLeft } from "lucide-react";

export default function ModulesPage({ modules, darkMode, t, onBack }) {
  return (
    <div
      className={`min-h-screen p-6 md:p-10 ${
        darkMode
          ? "bg-gradient-to-br from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* 🔙 Назад */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-pink-500 hover:text-rose-500 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          {t("Назад до дашборду", "Назад на главную")}
        </button>

        {/* Заголовок */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent text-center">
          {t("Мої модулі", "Мои модули")}
        </h1>

        {/* Список модулів */}
        {modules.length === 0 ? (
          <p className="text-center opacity-70 text-sm">
            {t("Модулів поки що немає", "Модулей пока нет")}
          </p>
        ) : (
          <div className="space-y-6">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className={`p-6 rounded-2xl shadow-lg border transition hover:scale-[1.02] ${
                  darkMode
                    ? "bg-[#1a0a1f]/70 border-fuchsia-900/30 hover:border-pink-500/40"
                    : "bg-white border-pink-200 hover:border-pink-400/70"
                }`}
              >
                <div className="flex items-center gap-4 mb-2">
                  <BookOpen className="w-6 h-6 text-pink-500" />
                  <h2 className="text-xl font-semibold">{mod.title}</h2>
                </div>

                {mod.description && (
                  <p className="text-sm opacity-80 leading-relaxed mb-3">
                    {mod.description}
                  </p>
                )}

                <p className="text-sm font-medium text-pink-600">
                  {mod.lessons || 0} {t("уроків", "уроков")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

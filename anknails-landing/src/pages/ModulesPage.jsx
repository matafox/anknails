// src/pages/ModulesPage.jsx
import { BookOpen, ChevronLeft } from "lucide-react";

export default function ModulesPage({ modules, darkMode, t, onBack }) {
  const gradients = [
    "from-pink-400/40 via-rose-400/30 to-amber-400/40",
    "from-violet-400/40 via-fuchsia-400/30 to-pink-400/40",
    "from-cyan-400/40 via-blue-400/30 to-purple-400/40",
    "from-emerald-400/40 via-lime-400/30 to-green-400/40",
    "from-orange-400/40 via-red-400/30 to-pink-400/40",
  ];

  return (
    <div
      className={`min-h-screen p-6 md:p-10 transition-colors ${
        darkMode
          ? "bg-gradient-to-br from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* 🔙 Назад */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-pink-500 hover:text-rose-500 transition font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          {t("Назад до дашборду", "Назад на главную")}
        </button>

        {/* Заголовок */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent text-center">
          {t("Мої модулі", "Мои модули")}
        </h1>

        {/* 📋 Модулі */}
        {modules.length === 0 ? (
          <p className="text-center opacity-70 text-sm">
            {t("Модулів поки що немає", "Модулей пока нет")}
          </p>
        ) : (
          <div className="space-y-8">
            {modules.map((mod, index) => {
              const gradient = gradients[index % gradients.length];
              return (
                <div
                  key={mod.id}
                  className={`relative p-6 rounded-2xl border overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,0,128,0.3)] ${
                    darkMode
                      ? "bg-[#1a0a1f]/80 border-fuchsia-900/30"
                      : "bg-white border-pink-200"
                  }`}
                >
                  {/* 🎨 Декоративний фон (градієнт навскоси) */}
                  <div
                    className={`absolute inset-0 opacity-40 bg-gradient-to-br ${gradient}`}
                    style={{
                      clipPath: "polygon(0 0, 60% 0, 100% 100%, 0 60%)",
                    }}
                  ></div>

                  {/* Контент */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className="w-6 h-6 text-pink-500" />
                      <h2 className="text-xl font-semibold">{mod.title}</h2>
                    </div>

                    {mod.description && (
                      <p className="text-sm opacity-80 mb-3 leading-relaxed">
                        {mod.description}
                      </p>
                    )}

                    <p className="text-sm font-medium text-pink-600">
                      {mod.lessons || 0} {t("уроків", "уроков")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

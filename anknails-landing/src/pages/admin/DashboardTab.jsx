import { Layers, BookOpen, Image, DollarSign, Settings } from "lucide-react";

export default function DashboardTab({ i18n, darkMode, setActiveTab }) {
  const items = [
    {
      id: "courses",
      label: i18n.language === "ru" ? "Курсы" : "Курси",
      icon: Layers,
    },
    {
      id: "modules",
      label: i18n.language === "ru" ? "Модули" : "Модулі",
      icon: BookOpen,
    },
    {
      id: "banner",
      label: i18n.language === "ru" ? "Баннер" : "Банер",
      icon: Image,
    },
    {
      id: "earnings",
      label: i18n.language === "ru" ? "Заработок" : "Заробіток",
      icon: DollarSign,
    },
    {
      id: "settings",
      label: i18n.language === "ru" ? "Настройки" : "Налаштування",
      icon: Settings,
    },
  ];

  return (
    <section
      className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 ${
        darkMode
          ? "border-fuchsia-900/30 bg-[#1a0a1f]/60 text-fuchsia-100"
          : "border-pink-200 bg-white/70 text-gray-800"
      }`}
    >
      <h2 className="text-2xl font-semibold mb-8 text-center bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-400 text-transparent bg-clip-text">
        {i18n.language === "ru" ? "Панель администратора" : "Панель адміністратора"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center justify-center p-8 rounded-2xl transition-all shadow-md hover:scale-[1.03] border ${
              darkMode
                ? "bg-[#15001f]/60 border-fuchsia-900/30 hover:bg-fuchsia-900/20"
                : "bg-white/70 border-pink-200 hover:bg-pink-100"
            }`}
          >
            <Icon className="w-10 h-10 text-pink-500 mb-3" />
            <span className="text-lg font-medium">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

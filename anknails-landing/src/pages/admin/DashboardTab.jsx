import { Layers, BookOpen, Image, DollarSign, Settings, Activity } from "lucide-react";

export default function DashboardTab({ i18n, darkMode, setActiveTab }) {
  const t = (ua, ru) => (i18n.language === "ru" ? ru : ua);

  const items = [
    {
      id: "courses",
      label: t("Курси", "Курсы"),
      icon: Layers,
    },
    {
      id: "modules",
      label: t("Модулі", "Модули"),
      icon: BookOpen,
    },
    {
      id: "banner",
      label: t("Банер", "Баннер"),
      icon: Image,
    },
    {
      id: "earnings",
      label: t("Заробіток", "Заработок"),
      icon: DollarSign,
    },
    // 🆕 ТРАФІК з бейджом NEW
    {
      id: "traffic",
      label: t("Трафік", "Трафик"),
      icon: Activity,
      badge: "NEW",
    },
    {
      id: "settings",
      label: t("Налаштування", "Настройки"),
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
        {t("Панель адміністратора", "Панель администратора")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`relative flex flex-col items-center justify-center p-8 rounded-2xl transition-all shadow-md hover:scale-[1.03] border ${
              darkMode
                ? "bg-[#15001f]/60 border-fuchsia-900/30 hover:bg-fuchsia-900/20"
                : "bg-white/70 border-pink-200 hover:bg-pink-100"
            }`}
          >
            {/* Бейдж NEW у правому верхньому куті */}
            {badge && (
              <span
                className={`absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-full uppercase
                  ${darkMode ? "bg-fuchsia-600/90 text-white" : "bg-pink-500 text-white"}
                  shadow-sm`}
              >
                {badge}
              </span>
            )}

            <Icon className="w-10 h-10 text-pink-500 mb-3" />
            <span className="text-lg font-medium">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

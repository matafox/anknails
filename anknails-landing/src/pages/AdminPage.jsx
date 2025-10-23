import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Users,
  Image,
  LogOut,
  PlusCircle,
  Settings,
} from "lucide-react";

export default function AdminPage() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("modules");
  const [darkMode, setDarkMode] = useState(false);

  // 🔐 Перевірка доступу
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token !== "true") {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/";
  };

  const tabs = [
    {
      id: "modules",
      label: i18n.language === "ru" ? "Модули курса" : "Модулі курсу",
      icon: BookOpen,
    },
    {
      id: "students",
      label: i18n.language === "ru" ? "Студенты" : "Студенти",
      icon: Users,
    },
    {
      id: "banner",
      label: i18n.language === "ru" ? "Баннер" : "Банер",
      icon: Image,
    },
    {
      id: "settings",
      label: i18n.language === "ru" ? "Настройки" : "Налаштування",
      icon: Settings,
    },
  ];

  return (
    <div
      className={`min-h-screen flex ${
        darkMode
          ? "bg-gradient-to-br from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      {/* 🩷 Бокове меню */}
      <aside
        className={`w-64 p-6 flex flex-col justify-between border-r ${
          darkMode
            ? "border-fuchsia-900/30 bg-[#1a0a1f]/70"
            : "border-pink-200 bg-white/70"
        } backdrop-blur-xl`}
      >
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 text-transparent bg-clip-text mb-6">
            ANK Studio LMS
          </h2>

          <nav className="space-y-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? darkMode
                      ? "bg-pink-500/30 text-fuchsia-100 border border-pink-400/40"
                      : "bg-pink-100 text-pink-700 border border-pink-300"
                    : darkMode
                    ? "hover:bg-fuchsia-900/20 text-fuchsia-200"
                    : "hover:bg-pink-50 text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-pink-500 hover:text-rose-500 transition"
        >
          <LogOut className="w-4 h-4" />
          {i18n.language === "ru" ? "Выйти" : "Вийти"}
        </button>
      </aside>

      {/* 🌸 Контент */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "modules" && (
          <section>
            <h2 className="text-2xl font-bold mb-6">
              {i18n.language === "ru" ? "Модули курса" : "Модулі курсу"}
            </h2>
            <button
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(255,0,128,0.3)]"
            >
              <PlusCircle className="w-5 h-5" />
              {i18n.language === "ru" ? "Добавить модуль" : "Додати модуль"}
            </button>
            <p className="mt-6 opacity-70">
              {i18n.language === "ru"
                ? "Здесь появится список всех учебных модулей после интеграции базы данных."
                : "Тут з’явиться список усіх навчальних модулів після підключення бази даних."}
            </p>
          </section>
        )}

        {activeTab === "students" && (
          <section>
            <h2 className="text-2xl font-bold mb-6">
              {i18n.language === "ru" ? "Студенты курса" : "Студенти курсу"}
            </h2>
            <p className="opacity-70">
              {i18n.language === "ru"
                ? "Позже здесь будет список студентов с доступом к курсу."
                : "Пізніше тут буде список студентів із доступом до курсу."}
            </p>
          </section>
        )}

        {activeTab === "banner" && (
          <section>
            <h2 className="text-2xl font-bold mb-6">
              {i18n.language === "ru" ? "Редактирование баннера" : "Редагування банера"}
            </h2>
            <p className="opacity-70">
              {i18n.language === "ru"
                ? "Позже добавим форму для загрузки баннера и текста акции."
                : "Пізніше додамо форму для завантаження банера й тексту акції."}
            </p>
          </section>
        )}

        {activeTab === "settings" && (
          <section>
            <h2 className="text-2xl font-bold mb-6">
              {i18n.language === "ru" ? "Настройки" : "Налаштування"}
            </h2>
            <p className="opacity-70">
              {i18n.language === "ru"
                ? "Тут можно будет создавать временные аккаунты и управлять доступом."
                : "Тут можна буде створювати тимчасові акаунти та керувати доступом."}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

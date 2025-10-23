import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, BookOpen, User, Clock, Mail } from "lucide-react";

export default function CabinetPage() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [modules, setModules] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // 🌓 Тема
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // 🧠 Авторизація
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const email = localStorage.getItem("user_email");
    const expires = localStorage.getItem("expires_at");

    if (!token || !email || !expires) {
      window.location.href = "/login";
      return;
    }

    const expiryDate = new Date(expires);
    if (expiryDate < new Date()) {
      localStorage.clear();
      alert(
        i18n.language === "ru"
          ? "Срок действия аккаунта истек"
          : "Термін дії акаунта минув"
      );
      window.location.href = "/login";
      return;
    }

    setUser({
      email,
      expires_at: expiryDate.toLocaleDateString(),
      active: true,
    });
  }, [i18n.language]);

  // 📚 Псевдо-модулі (пізніше замінимо на fetch)
  useEffect(() => {
    setModules([
      {
        id: 1,
        title:
          i18n.language === "ru"
            ? "Основы моделирования"
            : "Основи моделювання",
        progress: 80,
        lessons: 5,
      },
      {
        id: 2,
        title:
          i18n.language === "ru"
            ? "Работа с нижними формами"
            : "Робота з нижніми формами",
        progress: 45,
        lessons: 4,
      },
      {
        id: 3,
        title:
          i18n.language === "ru"
            ? "Дизайн и декор"
            : "Дизайн і декор",
        progress: 10,
        lessons: 6,
      },
    ]);
  }, [i18n.language]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <div
      className={`min-h-screen flex flex-col items-center px-6 py-10 ${
        darkMode
          ? "bg-gradient-to-b from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-b from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      {/* 🧍‍♀️ Профіль */}
      <div
        className={`w-full max-w-3xl rounded-3xl p-8 mb-8 backdrop-blur-xl ${
          darkMode
            ? "bg-[#1a0a1f]/70 border border-pink-500/30 shadow-[0_0_40px_rgba(255,0,128,0.25)]"
            : "bg-white/70 border border-pink-200/40 shadow-[0_0_40px_rgba(255,182,193,0.3)]"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <User className="w-14 h-14 text-pink-500" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 bg-clip-text text-transparent">
                {i18n.language === "ru"
                  ? "Добро пожаловать!"
                  : "Ласкаво просимо!"}
              </h1>
              <p className="opacity-80">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-pink-400" />
            <span>
              {i18n.language === "ru" ? "Доступ до:" : "Доступ до:"}{" "}
              <strong>{user.expires_at}</strong>
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 rounded-2xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-[1.03] transition-all shadow-[0_0_15px_rgba(255,0,128,0.3)]"
        >
          <LogOut className="w-5 h-5" />
          {i18n.language === "ru" ? "Выйти" : "Вийти"}
        </button>
      </div>

      {/* 📘 Мої модулі */}
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-pink-500" />
          {i18n.language === "ru" ? "Мои модули" : "Мої модулі"}
        </h2>

        <div className="space-y-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={`p-5 rounded-2xl transition border ${
                darkMode
                  ? "border-fuchsia-900/30 bg-[#1a0a1f]/60 hover:bg-[#2a0f3a]/40"
                  : "border-pink-200 bg-white/70 hover:bg-pink-50"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{mod.title}</h3>
                <span className="text-sm opacity-70">
                  {mod.progress}% • {mod.lessons}{" "}
                  {i18n.language === "ru" ? "уроков" : "уроків"}
                </span>
              </div>

              <div className="h-2 bg-pink-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-700"
                  style={{ width: `${mod.progress}%` }}
                ></div>
              </div>

              <button
                className="mt-4 w-full sm:w-auto px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:scale-[1.03] transition shadow-[0_0_10px_rgba(255,0,128,0.3)]"
                onClick={() => alert(`🚀 ${i18n.language === "ru" ? "Продолжить модуль" : "Продовжити модуль"}: ${mod.title}`)}
              >
                {i18n.language === "ru"
                  ? "Продолжить обучение"
                  : "Продовжити навчання"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 text-sm opacity-60">
        ANK Studio LMS © {new Date().getFullYear()}
      </p>
    </div>
  );
}

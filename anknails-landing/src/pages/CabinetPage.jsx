import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, BookOpen, User, Clock, Mail } from "lucide-react";

export default function CabinetPage() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [modules, setModules] = useState([]);
  const [banner, setBanner] = useState(null);
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

  // 🎀 Банер із бекенду
  useEffect(() => {
    fetch("https://anknails-backend-production.up.railway.app/api/banner")
      .then((res) => res.json())
      .then((data) => setBanner(data))
      .catch(() => console.error("Помилка завантаження банера"));
  }, []);

  // 📚 Псевдо-модулі
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
      className={`min-h-screen flex ${
        darkMode
          ? "bg-gradient-to-br from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      {/* 🩷 Бічне меню */}
      <aside
        className={`w-72 p-6 border-r backdrop-blur-xl ${
          darkMode
            ? "border-fuchsia-900/30 bg-[#1a0a1f]/60"
            : "border-pink-200 bg-white/70"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <User className="w-16 h-16 text-pink-500 mb-2" />
          <h2 className="text-lg font-bold">{user.email}</h2>
          <p className="text-sm opacity-70">
            {i18n.language === "ru" ? "Доступ до:" : "Доступ до:"} {user.expires_at}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-[1.03] transition-all shadow-[0_0_15px_rgba(255,0,128,0.3)]"
        >
          <LogOut className="w-5 h-5" />
          {i18n.language === "ru" ? "Выйти" : "Вийти"}
        </button>

        <div className="mt-10 border-t border-pink-200/30 pt-6">
          <h3 className="text-sm uppercase font-semibold opacity-70 mb-3">
            {i18n.language === "ru" ? "Разделы" : "Розділи"}
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-pink-500 transition cursor-pointer">
              {i18n.language === "ru" ? "Мои курсы" : "Мої курси"}
            </li>
            <li className="hover:text-pink-500 transition cursor-pointer">
              {i18n.language === "ru" ? "Помощь" : "Допомога"}
            </li>
          </ul>
        </div>
      </aside>

      {/* 🌸 Контент */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* 🎀 Банер */}
        {banner && banner.active && (
          <div className="rounded-2xl overflow-hidden mb-10 shadow-[0_0_25px_rgba(255,0,128,0.25)]">
            {banner.image_url && (
              <img
                src={banner.image_url}
                alt="Banner"
                className="w-full h-52 object-cover"
              />
            )}
            <div className="p-4 text-center bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-lg">
              {banner.title}
            </div>
          </div>
        )}

        {/* 📘 Мої модулі */}
        <section>
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 bg-clip-text text-transparent">
            {i18n.language === "ru" ? "Мои модули" : "Мої модулі"}
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className={`p-6 rounded-2xl transition border ${
                  darkMode
                    ? "border-fuchsia-900/30 bg-[#1a0a1f]/60 hover:bg-[#2a0f3a]/40"
                    : "border-pink-200 bg-white/70 hover:bg-pink-50"
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">{mod.title}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-70">
                    {mod.progress}% • {mod.lessons}{" "}
                    {i18n.language === "ru" ? "уроков" : "уроків"}
                  </span>
                  <button
                    onClick={() =>
                      alert(
                        `🚀 ${
                          i18n.language === "ru"
                            ? "Продолжить модуль"
                            : "Продовжити модуль"
                        }: ${mod.title}`
                      )
                    }
                    className="px-4 py-1.5 text-sm rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:scale-[1.03] transition"
                  >
                    {i18n.language === "ru"
                      ? "Открыть"
                      : "Відкрити"}
                  </button>
                </div>
                <div className="h-2 bg-pink-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-700"
                    style={{ width: `${mod.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-10 text-sm opacity-60 text-center">
          ANK Studio LMS © {new Date().getFullYear()}
        </p>
      </main>
    </div>
  );
}

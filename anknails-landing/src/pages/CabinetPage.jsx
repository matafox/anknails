import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, User, Menu, X, BookOpen, Clock } from "lucide-react";

export default function CabinetPage() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [banner, setBanner] = useState(null);
  const [modules, setModules] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const BACKEND = "https://anknails-backend-production.up.railway.app";

  // 🌓 Тема
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // 🧠 Авторизація + дані користувача з бекенду
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

    // 🧾 Отримати ім’я користувача з бекенду
    fetch(`${BACKEND}/api/users`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.users?.find((u) => u.email === email);
        setUser({
          email,
          name: found?.name || null,
          expires_at: expiryDate.toLocaleDateString(),
          active: true,
        });
      })
      .catch(() => {
        // fallback якщо не вдалося завантажити
        setUser({
          email,
          name: null,
          expires_at: expiryDate.toLocaleDateString(),
          active: true,
        });
      });
  }, [i18n.language]);

  // 🎀 Банер із бекенду
  useEffect(() => {
    fetch(`${BACKEND}/api/banner`)
      .then((res) => res.json())
      .then((data) => setBanner(data))
      .catch(() => console.error("Помилка завантаження банера"));
  }, []);

  // 📘 Модулі з бекенду
  useEffect(() => {
    fetch(`${BACKEND}/api/modules`)
      .then((res) => res.json())
      .then((data) => setModules(data.modules || []))
      .catch(() => console.error("Помилка завантаження модулів"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (!user) return null;

  const displayName = user.name || user.email;

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${
        darkMode
          ? "bg-gradient-to-br from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      {/* 📱 Мобільна шапка */}
      <header
        className={`md:hidden flex items-center justify-between px-5 py-4 border-b ${
          darkMode
            ? "border-fuchsia-900/30 bg-[#1a0a1f]/70"
            : "border-pink-200 bg-white/80"
        } backdrop-blur-xl sticky top-0 z-20`}
      >
        <h1 className="text-lg font-bold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 bg-clip-text text-transparent">
          ANK Studio
        </h1>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* 🩷 Бокове меню (адаптивне) */}
      <aside
        className={`md:w-72 md:static fixed top-0 left-0 h-full md:h-auto transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform duration-300 z-10 md:z-0 p-6 border-r backdrop-blur-xl ${
          darkMode
            ? "border-fuchsia-900/30 bg-[#1a0a1f]/70"
            : "border-pink-200 bg-white/70"
        }`}
      >
        <div className="flex flex-col items-center text-center md:mt-0 mt-12">
          <User className="w-16 h-16 text-pink-500 mb-2" />
          <h2 className="text-lg font-bold">{displayName}</h2>
          <p className="text-sm opacity-70">
            {i18n.language === "ru" ? "Доступ до:" : "Доступ до:"}{" "}
            {user.expires_at}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-[1.03] transition-all shadow-[0_0_15px_rgba(255,0,128,0.3)]"
        >
          <LogOut className="w-5 h-5" />
          {i18n.language === "ru" ? "Выйти" : "Вийти"}
        </button>

        <div className="mt-10 border-t border-pink-200/30 pt-6 text-sm text-center md:text-left">
          <h3 className="uppercase font-semibold opacity-70 mb-3">
            {i18n.language === "ru" ? "Разделы" : "Розділи"}
          </h3>
          <ul className="space-y-2">
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
      <main className="flex-1 p-5 md:p-10 overflow-y-auto">
        {/* 🎀 Банер */}
        {banner && banner.active && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-[0_0_25px_rgba(255,0,128,0.25)]">
            {banner.image_url && (
              <img
                src={banner.image_url}
                alt="Banner"
                className="w-full h-48 md:h-64 object-cover"
              />
            )}
            <div className="p-4 text-center bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-base md:text-lg">
              {banner.title}
            </div>
          </div>
        )}

        {/* 📘 Модулі */}
        {modules.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className={`p-5 rounded-2xl border transition-all hover:shadow-[0_0_20px_rgba(255,0,128,0.2)] ${
                  darkMode
                    ? "border-fuchsia-900/30 bg-[#1a0a1f]/70"
                    : "border-pink-200 bg-white/80"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-6 h-6 text-pink-500" />
                  <h3 className="text-lg font-semibold">{mod.title}</h3>
                </div>
                <p className="text-sm opacity-80 mb-3">{mod.description}</p>
                <div className="flex items-center gap-2 text-sm opacity-70">
                  <Clock className="w-4 h-4" />
                  {i18n.language === "ru" ? "Уроков" : "Уроків"}: {mod.lessons}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-70">
            <p className="text-lg">
              {i18n.language === "ru"
                ? "Модули пока не добавлены"
                : "Модулі ще не додані"}
            </p>
          </div>
        )}

        <p className="mt-10 text-sm opacity-60 text-center">
          ANK Studio LMS © {new Date().getFullYear()}
        </p>
      </main>
    </div>
  );
}

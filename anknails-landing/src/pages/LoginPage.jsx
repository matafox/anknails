import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogIn, Mail, Lock, HelpCircle, Moon, Globe } from "lucide-react";

export default function LoginPage() {
  const { i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // ===== THEME INIT =====
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const setTheme = (isDark) => {
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Швидкий адмін-вхід
      if (email === "annaivanovna1802@gmail.com" && password === "anka12341") {
        localStorage.setItem("admin_token", "true");
        localStorage.removeItem("user_token");
        window.location.href = "/admin";
        return;
      }

      const res = await fetch("https://anknails-backend-production.up.railway.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, lang: i18n.language }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        throw new Error(
          data.detail ||
            (i18n.language === "ru"
              ? "Ошибка входа. Проверьте данные."
              : "Помилка входу. Перевірте дані.")
        );
      }

      localStorage.setItem("user_token", "true");
      localStorage.setItem("user_email", data.user.email);
      localStorage.setItem("expires_at", data.user.expires_at);
      localStorage.removeItem("admin_token");

      if (data.session_token) {
        localStorage.setItem("session_token", data.session_token);
      }

      window.location.href = "/profile";
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const t = (ua, ru) => (i18n.language === "ru" ? ru : ua);

  return (
    <div
      className={`min-h-screen flex ${
        darkMode
          ? "bg-gradient-to-br from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      {/* ===== SIDEBAR (білий із легким градієнтом) ===== */}
      <aside
        className={`hidden md:flex md:w-80 lg:w-96 flex-col border-r ${
          darkMode ? "border-fuchsia-900/30 bg-white/5" : "border-pink-200 bg-gradient-to-b from-white to-rose-50"
        }`}
      >
        {/* Top brand */}
        <div className="p-6 border-b border-pink-200/40">
          <div
            className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 bg-clip-text text-transparent cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            ANK Studio
          </div>
          <p className={`mt-2 text-sm ${darkMode ? "text-fuchsia-200/80" : "text-gray-600"}`}>
            {t("Ласкаво просимо до платформи", "Добро пожаловать на платформу")}
          </p>
        </div>

        {/* Scrollable content (можна додати навігацію, підказки тощо) */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div
            className={`rounded-2xl p-4 border ${
              darkMode ? "border-fuchsia-900/40 bg-[#1a0a1f]/50" : "border-pink-200 bg-white/70"
            }`}
          >
            <h3 className="font-semibold text-pink-600 mb-2">
              {t("Маєте питання?", "Есть вопросы?")}
            </h3>
            <p className={`text-sm ${darkMode ? "text-fuchsia-100/80" : "text-gray-700"}`}>
              {t(
                "Наша підтримка допоможе з входом та доступом до курсу.",
                "Наша поддержка поможет со входом и доступом к курсу."
              )}
            </p>
            <a
              href="https://t.me/m/cE5yXCdSZTAy"
              className={`mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition ${
                darkMode
                  ? "border-fuchsia-900/30 bg-[#1a0a1f]/60 hover:bg-[#1a0a1f]/80 text-fuchsia-100"
                  : "border-pink-200 bg-white hover:bg-white text-pink-600"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              {t("Підтримка", "Поддержка")}
            </a>
          </div>
        </div>

        {/* Sidebar footer (всередині сайдбару) */}
        <div className="p-6 border-t border-pink-200/40">
          {/* Theme toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-pink-500" />
              <span>{t("Темна тема", "Тёмная тема")}</span>
            </div>
            <button
              onClick={() => setTheme(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition-all duration-500 ease-out ${
                darkMode
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                  : "bg-pink-200"
              }`}
            >
              <span
                className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-500 ease-out ${
                  darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-pink-500" />
              <span>{t("Мова", "Язык")}</span>
            </div>
            <div className="flex gap-2">
              {["ru", "uk"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    i18n.changeLanguage(lang);
                    localStorage.setItem("lang", lang);
                  }}
                  className={`px-3 py-1 rounded-lg font-medium border text-xs transition-all duration-300 ${
                    i18n.language === lang
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white text-pink-600 border-pink-300 hover:bg-pink-100"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <p className={`mt-6 text-xs opacity-70 ${darkMode ? "text-fuchsia-200/70" : "text-gray-600"}`}>
            © {new Date().getFullYear()} ANK Studio LMS
          </p>
        </div>
      </aside>

      {/* ===== RIGHT COLUMN (HEADER + MAIN) ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header
          className={`sticky top-0 z-40 border-b backdrop-blur-xl px-5 md:px-8 py-3 flex items-center justify-between ${
            darkMode ? "border-fuchsia-900/30 bg-[#1a0a1f]/70" : "border-pink-200 bg-white/60"
          }`}
        >
          <div
            className="font-extrabold tracking-tight text-lg md:text-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 bg-clip-text text-transparent cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            ANK Studio
          </div>

          {/* Праворуч можемо додати посилання "На сайт" */}
          <button
            onClick={() => (window.location.href = "/")}
            className={`text-sm font-medium ${
              darkMode ? "text-fuchsia-100 hover:text-white" : "text-pink-600 hover:text-rose-600"
            }`}
          >
            {t("Повернутися на сайт", "Назад на сайт")}
          </button>
        </header>

        {/* MAIN — вікно логіну зліва */}
        <main className="flex-1 px-5 md:px-10 py-8">
          <div className="mx-auto w-full max-w-6xl">
            {/* Card вирівняний по лівому краю */}
            <div
              className={`w-full max-w-md rounded-[2rem] p-8 md:p-10 backdrop-blur-2xl border transition-all duration-500 shadow-2xl ${
                darkMode
                  ? "bg-[#1a0a1f]/70 border-pink-500/30 shadow-[0_0_60px_rgba(255,0,128,0.25)]"
                  : "bg-white/70 border-pink-200/60 shadow-[0_0_50px_rgba(255,182,193,0.35)]"
              }`}
            >
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-pink-600">ANK Studio Online</h1>
                <p className="mt-2 text-sm opacity-75 font-medium">
                  {t("Введіть дані для входу до акаунту", "Введите данные для входа в аккаунт")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-pink-400 group-focus-within:text-pink-500 transition" />
                  <input
                    type="email"
                    placeholder={i18n.language === "ru" ? "Email" : "Електронна пошта"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full pl-12 pr-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                      darkMode
                        ? "bg-[#2a0f3a]/40 border-fuchsia-700/30 focus:ring-pink-400 text-fuchsia-100"
                        : "bg-white/80 border-pink-200 focus:ring-pink-400 text-gray-800"
                    }`}
                  />
                </div>

                {/* Password */}
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-pink-400 group-focus-within:text-pink-500 transition" />
                  <input
                    type="password"
                    placeholder={i18n.language === "ru" ? "Пароль" : "Пароль"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full pl-12 pr-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                      darkMode
                        ? "bg-[#2a0f3a]/40 border-fuchsia-700/30 focus:ring-pink-400 text-fuchsia-100"
                        : "bg-white/80 border-pink-200 focus:ring-pink-400 text-gray-800"
                    }`}
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-sm text-rose-500 text-center font-medium animate-pulse">
                    {error}
                  </p>
                )}

                {/* Submit — сіра кнопка без іконки (як просив раніше) */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center py-3.5 rounded-2xl font-semibold text-white transition-all duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-500 hover:bg-gray-600"
                  }`}
                >
                  {loading
                    ? t("Завантаження...", "Загрузка...")
                    : t("Увійти", "Войти")}
                </button>
              </form>

              {/* Лінк «На сайт» для дубляжу під формою (моб/UX) */}
              <div className="text-center mt-6">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="text-sm font-medium text-pink-500 hover:text-rose-500 transition"
                >
                  {t("Повернутися на сайт", "Назад на сайт")}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

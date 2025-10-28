import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogIn, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const { i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (email === "annaivanovna1802@gmail.com" && password === "anka12341") {
        localStorage.setItem("admin_token", "true");
        localStorage.removeItem("user_token");
        window.location.href = "/admin";
        return;
      }

      const res = await fetch(
        "https://anknails-backend-production.up.railway.app/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, lang: i18n.language }),
        }
      );

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

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
        darkMode
          ? "bg-gradient-to-br from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      {/* 🌸 Градієнтні кола */}
      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] rounded-full bg-fuchsia-300/30 blur-[150px]" />
      <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full bg-rose-400/20 blur-[150px]" />

      {/* 💎 Скляна картка */}
      <div
        className={`relative z-10 w-full max-w-md p-10 rounded-[2rem] backdrop-blur-2xl border transition-all duration-500 shadow-2xl ${
          darkMode
            ? "bg-[#1a0a1f]/70 border-pink-500/30 shadow-[0_0_60px_rgba(255,0,128,0.25)]"
            : "bg-white/60 border-pink-200/40 shadow-[0_0_50px_rgba(255,182,193,0.4)]"
        }`}
      >
        {/* ✨ Логотип і назва */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            ANK&nbsp;Studio
          </h1>
          <p className="mt-3 text-sm opacity-75 font-medium">
            {i18n.language === "ru"
              ? "Введите данные для входа в аккаунт"
              : "Введіть дані для входу до акаунту"}
          </p>
        </div>

        {/* 🪞 Форма */}
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
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 transition-all duration-300
                ${
                  darkMode
                    ? "bg-[#2a0f3a]/40 border-fuchsia-700/30 focus:ring-pink-400 text-fuchsia-100"
                    : "bg-white/70 border-pink-200 focus:ring-pink-400 text-gray-800"
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
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 transition-all duration-300
                ${
                  darkMode
                    ? "bg-[#2a0f3a]/40 border-fuchsia-700/30 focus:ring-pink-400 text-fuchsia-100"
                    : "bg-white/70 border-pink-200 focus:ring-pink-400 text-gray-800"
                }`}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-rose-500 text-center font-medium animate-pulse">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-semibold text-white transition-all duration-300
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(255,0,128,0.4)]"
              }`}
          >
            <LogIn className="w-5 h-5" />
            {loading
              ? i18n.language === "ru"
                ? "Загрузка..."
                : "Завантаження..."
              : i18n.language === "ru"
              ? "Войти"
              : "Увійти"}
          </button>
        </form>

        {/* Назад */}
        <div className="text-center mt-8">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-sm font-medium text-pink-500 hover:text-rose-500 transition"
          >
            {i18n.language === "ru" ? "Назад на сайт" : "Повернутися на сайт"}
          </button>
        </div>
      </div>
    </div>
  );
}

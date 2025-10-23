import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LogIn, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const { i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "annaivanovna1802@gmail.com" && password === "anka12341") {
      localStorage.setItem("admin_token", "true");
      setError("");
      window.location.href = "/"; // редірект після входу
    } else {
      setError(
        i18n.language === "ru"
          ? "Неверный email или пароль"
          : "Невірний email або пароль"
      );
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 ${
        darkMode
          ? "bg-gradient-to-b from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-b from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl p-10 backdrop-blur-xl transition-all duration-500 ${
          darkMode
            ? "bg-[#1a0a1f]/70 border border-pink-500/30 shadow-[0_0_60px_rgba(255,0,128,0.25)]"
            : "bg-white/70 border border-pink-200/40 shadow-[0_0_50px_rgba(255,182,193,0.4)]"
        }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 bg-clip-text text-transparent">
            {i18n.language === "ru" ? "Вход" : "Вхід"}
          </h1>
          <p className="mt-2 text-sm opacity-70">
            {i18n.language === "ru"
              ? "Введите данные для авторизации"
              : "Введіть дані для авторизації"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-pink-400" />
            <input
              type="email"
              placeholder={i18n.language === "ru" ? "Email" : "Електронна пошта"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 transition-all ${
                darkMode
                  ? "bg-[#2a0f3a]/40 border-fuchsia-700/30 focus:ring-pink-400"
                  : "bg-white/70 border-pink-200 focus:ring-pink-400"
              }`}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-pink-400" />
            <input
              type="password"
              placeholder={i18n.language === "ru" ? "Пароль" : "Пароль"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 transition-all ${
                darkMode
                  ? "bg-[#2a0f3a]/40 border-fuchsia-700/30 focus:ring-pink-400"
                  : "bg-white/70 border-pink-200 focus:ring-pink-400"
              }`}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-rose-500 text-center font-medium">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-[0_0_25px_rgba(255,0,128,0.5)] hover:scale-[1.03] transition-all duration-300"
          >
            <LogIn className="w-5 h-5" />
            {i18n.language === "ru" ? "Войти" : "Увійти"}
          </button>
        </form>

        {/* Назад на головну */}
        <div className="text-center mt-6">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-sm text-pink-500 hover:text-rose-500 transition"
          >
            {i18n.language === "ru" ? "Назад на сайт" : "Повернутися на сайт"}
          </button>
        </div>
      </div>
    </div>
  );
}

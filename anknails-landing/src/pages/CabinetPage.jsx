import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, User, Clock, Mail } from "lucide-react";

export default function CabinetPage() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // 🧠 Завантаження теми
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // 🧩 Перевірка авторизації
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
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("expires_at");
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
    });
  }, [i18n.language]);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("expires_at");
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-6 ${
        darkMode
          ? "bg-gradient-to-b from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-b from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl p-8 text-center backdrop-blur-xl ${
          darkMode
            ? "bg-[#1a0a1f]/70 border border-pink-500/30 shadow-[0_0_40px_rgba(255,0,128,0.25)]"
            : "bg-white/70 border border-pink-200/40 shadow-[0_0_40px_rgba(255,182,193,0.3)]"
        }`}
      >
        <User className="mx-auto w-14 h-14 mb-4 text-pink-500" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 bg-clip-text text-transparent">
          {i18n.language === "ru" ? "Профиль пользователя" : "Профіль користувача"}
        </h1>

        <div className="mt-8 space-y-4 text-left">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-pink-400" />
            <p>
              <span className="font-medium">
                {i18n.language === "ru" ? "Email:" : "Електронна пошта:"}
              </span>{" "}
              {user.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-pink-400" />
            <p>
              <span className="font-medium">
                {i18n.language === "ru" ? "Доступ до:" : "Доступ до:"}
              </span>{" "}
              {user.expires_at}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(255,0,128,0.3)]"
        >
          <LogOut className="w-5 h-5" />
          {i18n.language === "ru" ? "Выйти" : "Вийти"}
        </button>
      </div>

      <p className="mt-6 text-sm opacity-60">
        ANK Studio LMS © {new Date().getFullYear()}
      </p>
    </div>
  );
}

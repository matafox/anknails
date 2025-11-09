import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = (ua, ru) => (i18n.language === "ru" ? ru : ua);

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
      if (data.session_token) localStorage.setItem("session_token", data.session_token);

      window.location.href = "/profile";
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800">
      {/* Порожній сайдбар (як у кабінеті) */}
      <aside className="hidden md:block md:w-72 border-r border-pink-200 bg-gradient-to-b from-white to-rose-50" />

      {/* Контентна частина */}
      <div className="flex-1 min-h-screen flex flex-col">
        {/* Центрований блок логіну */}
        <main className="flex-1 flex items-center justify-center px-5">
          <div className="w-full max-w-md rounded-[2rem] p-8 md:p-10 bg-white/80 backdrop-blur border border-pink-200/60 shadow-[0_0_40px_rgba(255,182,193,0.35)]">
            {/* 🔹 Привітання над формою */}
            <div className="mb-8 text-center">
              <p className="mt-2 text-sm opacity-75">
                {t("Увійдіть, щоб почати навчання", "Войдите, чтобы начать обучение")}
              </p>
            </div>

            {/* Форма логіну */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder={t("Електронна пошта", "Email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder={t("Пароль", "Пароль")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {error && (
                <p className="text-sm text-rose-500 text-center font-medium">{error}</p>
              )}

              {/* 🌈 Яскрава градієнтна кнопка */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-2xl font-semibold text-white transition transform
                  ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 hover:shadow-[0_0_25px_rgba(255,0,128,0.35)] hover:scale-[1.02] active:scale-[0.99]"
                  }`}
              >
                {loading ? t("Завантаження...", "Загрузка...") : t("Увійти", "Войти")}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/")}
                  className="text-sm font-medium text-pink-600 hover:text-rose-600"
                >
                  {t("Повернутися на сайт", "Назад на сайт")}
                </button>
              </div>
            </form>
          </div>
        </main>

        {/* ====== Футер дашборду (світла тема) ====== */}
        <footer className="mt-8 text-center py-6 text-sm border-t border-pink-200 text-gray-600">
          <p className="font-medium">
            © {new Date().getFullYear()} <span className="text-pink-500 font-semibold">ANK Studio LMS</span> •{" "}
            {t("Усі права захищені.", "Все права защищены.")}
          </p>
        </footer>
      </div>
    </div>
  );
}

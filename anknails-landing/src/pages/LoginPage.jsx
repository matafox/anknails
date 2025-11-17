import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header"; // ⬅️ хедер

const BACKEND = "https://anknails-backend-production.up.railway.app";

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
      const res = await fetch(`${BACKEND}/api/login`, {
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
      if (data.user.expires_at) {
        localStorage.setItem("expires_at", data.user.expires_at);
      }
      if (data.session_token) {
        localStorage.setItem("session_token", data.session_token);
      }

      if (data.user.is_admin || data.user.role === "admin") {
        localStorage.setItem("admin_token", "true");
        window.location.href = "/admin";
      } else {
        localStorage.removeItem("admin_token");
        window.location.href = "/profile";
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <>
      {/* 🔁 Анімація бензинового фону для сайдбара */}
      <style>{`
        @keyframes gasolineShift {
          0% {
            background-position: 0% 0%;
            filter: hue-rotate(0deg);
          }
          50% {
            background-position: 100% 50%;
            filter: hue-rotate(25deg);
          }
          100% {
            background-position: 0% 100%;
            filter: hue-rotate(-25deg);
          }
        }
      `}</style>

      <div
        className="
          min-h-screen flex flex-col 
          text-gray-800 
          bg-gradient-to-br from-pink-50 via-rose-50 to-white
          dark:text-fuchsia-50
          dark:bg-[radial-gradient(circle_at_top,_#2b0f3d_0,_#12051f_42%,_#05000b_85%)]
        "
      >
        {/* ✅ Фіксований хедер */}
        <Header />

        <div className="flex-1 w-full flex">
          {/* 🛢 Сайдбар з переливом «бензину» */}
          <aside
            className="
              hidden md:block md:w-72 
              border-r border-pink-200/40 dark:border-fuchsia-900/40
              relative overflow-hidden
            "
          >
            {/* бензиновий шар */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(120deg,
                    rgba(37,99,235,0.95),
                    rgba(59,130,246,0.95),
                    rgba(56,189,248,0.95),
                    rgba(252,211,77,0.9),
                    rgba(249,115,22,0.95),
                    rgba(244,63,94,0.9),
                    rgba(129,140,248,0.95)
                  ),
                  radial-gradient(circle at 15% 20%, rgba(255,255,255,0.35) 0, transparent 55%),
                  radial-gradient(circle at 85% 80%, rgba(255,255,255,0.18) 0, transparent 55%)
                `,
                backgroundSize: "280% 280%",
                backgroundPosition: "0% 0%",
                animation: "gasolineShift 26s ease-in-out infinite alternate",
              }}
            />
            {/* мʼякий overlay, щоб не було надто кислотно */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-rose-50/88 to-amber-50/85 dark:from-[#050008]/90 dark:via-[#05000d]/94 dark:to-[#010006]/96 mix-blend-soft-light" />
          </aside>

          {/* Центрований блок логіну */}
          <main className="flex-1 flex items-center justify-center px-5">
            <div
              className="
                w-full max-w-md rounded-[2rem] p-8 md:p-10
                bg-white/80 
                dark:bg-[#15061f]/85
                backdrop-blur
                border border-pink-200/60 dark:border-fuchsia-900/40
                shadow-[0_0_22px_rgba(236,72,153,0.18)]
                dark:shadow-[0_0_22px_rgba(236,72,153,0.22)]
              "
            >
              <div className="mb-8 text-center">
                <p className="mt-2 text-sm opacity-75">
                  {t(
                    "Увійдіть, щоб почати навчання",
                    "Войдите, чтобы начать обучение"
                  )}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    placeholder={t("Електронна пошта", "Email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-white dark:bg-white/5 dark:text-fuchsia-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder={t("Пароль", "Пароль")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-white dark:bg-white/5 dark:text-fuchsia-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                {error && (
                  <p className="text-sm text-rose-500 text-center font-medium">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-2xl font-semibold text-white transition transform
                    ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 hover:shadow-[0_0_25px_rgba(255,0,128,0.35)] hover:scale-[1.02] active:scale-[0.99]"
                    }`}
                >
                  {loading
                    ? t("Завантаження...", "Загрузка...")
                    : t("Увійти", "Войти")}
                </button>
              </form>
            </div>
          </main>
        </div>

        <footer className="text-center py-6 text-sm border-t border-pink-200/60 dark:border-fuchsia-900/30 text-gray-600 dark:text-fuchsia-200">
          <p className="font-medium">
            © {new Date().getFullYear()}{" "}
            <span className="text-pink-500 font-semibold">ANK Studio LMS</span>{" "}
            • {t("Усі права захищені.", "Все права защищены.")}
          </p>
        </footer>
      </div>
    </>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import Header from "../components/Header";

// 🔗 LMS-бекенд (де живуть учні/курси ANK)
// В Netlify ставимо VITE_LMS_BACKEND_URL=https://anknails-backend-production.up.railway.app
const LMS_BACKEND =
  import.meta.env.VITE_LMS_BACKEND_URL ||
  "https://anknails-backend-production.up.railway.app";

/**
 * ПЛАТФОРМА / БАЗОВИЙ PATH
 * 1) Якщо є env:
 *    VITE_PLATFORM_SLUG=ankstudio
 *    VITE_BASE_PATH=/ankstudio
 *    — використовуємо їх.
 * 2) Якщо немає — беремо перший сегмент з поточного URL.
 */

// slug платформи (ankstudio)
const PLATFORM_SLUG = (() => {
  if (import.meta.env.VITE_PLATFORM_SLUG) {
    return import.meta.env.VITE_PLATFORM_SLUG.replace(/\//g, "");
  }
  if (typeof window === "undefined") return "";
  const segments = window.location.pathname.split("/").filter(Boolean);
  return segments[0] || "";
})();

// базовий path для редіректів (/ankstudio або "")
const BASE_PATH = (() => {
  if (import.meta.env.VITE_BASE_PATH) {
    const v = import.meta.env.VITE_BASE_PATH;
    return v.startsWith("/") ? v : `/${v}`;
  }
  return PLATFORM_SLUG ? `/${PLATFORM_SLUG}` : "";
})();

// 🎨 варіанти бензинових градієнтів
const RADIAL_OVERLAY_PART = `
  radial-gradient(circle at 15% 20%, rgba(255,255,255,0.35) 0, transparent 55%),
  radial-gradient(circle at 85% 80%, rgba(255,255,255,0.18) 0, transparent 55%)
`;

const GASOLINE_GRADIENTS = [
  `
    linear-gradient(120deg,
      rgba(37,99,235,0.95),
      rgba(59,130,246,0.95),
      rgba(56,189,248,0.95),
      rgba(252,211,77,0.9),
      rgba(249,115,22,0.95),
      rgba(244,63,94,0.9),
      rgba(129,140,248,0.95)
    ),
    ${RADIAL_OVERLAY_PART}
  `,
  `
    linear-gradient(130deg,
      rgba(76,29,149,0.95),
      rgba(124,58,237,0.95),
      rgba(45,212,191,0.95),
      rgba(34,197,94,0.9),
      rgba(249,115,22,0.95),
      rgba(236,72,153,0.95)
    ),
    ${RADIAL_OVERLAY_PART}
  `,
  `
    linear-gradient(140deg,
      rgba(236,72,153,0.95),
      rgba(251,113,133,0.95),
      rgba(250,204,21,0.95),
      rgba(56,189,248,0.95),
      rgba(129,140,248,0.95),
      rgba(168,85,247,0.95)
    ),
    ${RADIAL_OVERLAY_PART}
  `,
];

export default function LoginPage() {
  const { i18n } = useTranslation();
  const t = (ua, ru) => (i18n.language === "ru" ? ru : ua);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [paletteIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const saved = localStorage.getItem("ank_login_sidebar_palette");
      if (saved !== null) {
        const n = parseInt(saved, 10);
        if (!Number.isNaN(n) && n >= 0 && n < GASOLINE_GRADIENTS.length) {
          return n;
        }
      }
      const randomIdx = Math.floor(Math.random() * GASOLINE_GRADIENTS.length);
      localStorage.setItem("ank_login_sidebar_palette", String(randomIdx));
      return randomIdx;
    } catch {
      return 0;
    }
  });

  const sidebarBg = GASOLINE_GRADIENTS[paletteIndex] || GASOLINE_GRADIENTS[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${LMS_BACKEND}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          lang: i18n.language,
          platform_slug: PLATFORM_SLUG || null,
        }),
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

      // зберігаємо юзера
      localStorage.setItem("user_token", "true");
      localStorage.setItem("user_email", data.user.email);
      if (data.user.expires_at) {
        localStorage.setItem("expires_at", data.user.expires_at);
      }
      if (data.session_token) {
        localStorage.setItem("session_token", data.session_token);
      }

      // admin / student
      if (data.user.is_admin || data.user.role === "admin") {
        localStorage.setItem("admin_token", "true");
        window.location.href = `${BASE_PATH}/admin`;
      } else {
        localStorage.removeItem("admin_token");
        window.location.href = `${BASE_PATH}/profile`;
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <>
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

        @keyframes floatingText {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }

        .ank-login-floating-text {
          animation: floatingText 9s ease-in-out infinite;
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
        <Header />

        <div className="flex-1 w-full flex">
          <aside
            className="
              hidden md:block md:w-72 
              border-r border-pink-200/40 dark:border-fuchsia-900/40
              relative overflow-hidden
            "
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: sidebarBg,
                backgroundSize: "280% 280%",
                backgroundPosition: "0% 0%",
                animation: "gasolineShift 26s ease-in-out infinite alternate",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-rose-50/88 to-amber-50/85 dark:from-[#050008]/90 dark:via-[#05000d]/94 dark:to-[#010006]/96 mix-blend-soft-light" />

            <div className="relative z-20 h-full flex flex-col justify-between px-6 py-8 text-slate-9 dark:text-fuchsia-50">
              <p className="text-[11px] uppercase tracking-[0.25em] opacity-75">
                {t(
                  "професійна онлайн-платформа ANK Studio",
                  "профессиональная онлайн-платформа ANK Studio"
                )}
              </p>

              <div className="mt-auto mb-4">
                <p className="ank-login-floating-text text-lg font-semibold leading-snug">
                  {t(
                    "Курс уже в процесі: модулі вибудувані від основ до впевненої роботи з клієнтами.",
                    "Курс уже в процессе: модули выстроены от базы до уверенной работы с клиентами."
                  )}
                </p>
                <p className="mt-3 text-xs opacity-80 max-w-xs">
                  {t(
                    "Якщо ви вже на курсі — просто продовжуйте навчання у своєму кабінеті. Якщо ще ні — встигніть приєднатися до поточного потоку: записи, оновлення та матеріали залишаються з вами.",
                    "Если вы уже на курсе — просто продолжайте обучение в личном кабинете. Если ещё нет — успейте присоединиться к текущему потоку: записи, обновления и материалы остаются с вами."
                  )}
                </p>
              </div>
            </div>
          </aside>

          <main className="flex-1 flex items-center justify-center px-5">
            <div
              className="
                w-full max-w-md rounded-2xl p-8 md:p-10
                bg-white/90 
                dark:bg-[#15061f]/90
                backdrop-blur-sm
                border border-pink-100/70 dark:border-fuchsia-900/40
                shadow-sm
              "
            >
              <div className="mb-7 text-center">
                <p className="text-sm opacity-80">
                  {t(
                    "Увійдіть до особистого кабінету, щоб продовжити навчання.",
                    "Войдите в личный кабинет, чтобы продолжить обучение."
                  )}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium mb-1.5 opacity-70">
                    {t("Електронна пошта", "Email")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="
                      w-full px-4 py-2.5 rounded-xl border border-pink-100
                      bg-white dark:bg-white/5 dark:text-fuchsia-100
                      focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300
                      text-sm
                    "
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 opacity-70">
                    {t("Пароль", "Пароль")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="
                        w-full px-4 py-2.5 pr-11 rounded-xl border border-pink-100
                        bg-white dark:bg-white/5 dark:text-fuchsia-100
                        focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300
                        text-sm
                      "
                      placeholder={t("Введіть пароль", "Введите пароль")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="
                        absolute inset-y-0 right-3 flex items-center
                        text-pink-400 hover:text-pink-500 dark:text-pink-300 dark:hover:text-pink-200
                      "
                      aria-label={t("Показати пароль", "Показать пароль")}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-rose-500 text-center font-medium">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-sm font-semibold text-white transition
                    ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 hover:opacity-95 active:scale-[0.99]"
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

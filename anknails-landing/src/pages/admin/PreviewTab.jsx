import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, Monitor, Tablet, Smartphone } from "lucide-react";

const BACKEND = "https://anknails-backend-production.up.railway.app";
// Що показуємо в превʼю (кабінет учениці)
const FRONT_PREVIEW_URL = "/profile";

export default function PreviewTab({ darkMode }) {
  const { i18n } = useTranslation();

  const [previewMode, setPreviewMode] = useState("mobile"); // desktop | tablet | mobile
  const [previewUser, setPreviewUser] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewInitialized, setPreviewInitialized] = useState(false);

  // ініціалізація превʼю: логінимось під юзером з id = 2
  useEffect(() => {
    const initPreview = async () => {
      try {
        setPreviewLoading(true);
        setPreviewError("");

        const TEST_USER_ID = 2;

        const resUsers = await fetch(`${BACKEND}/api/users`);
        const dataUsers = await resUsers.json();

        const users = dataUsers?.users || [];
        const testUser = users.find((u) => u.id === TEST_USER_ID);

        if (!testUser) {
          throw new Error(
            i18n.language === "ru"
              ? `Пользователь с id=${TEST_USER_ID} не найден.`
              : `Користувача з id=${TEST_USER_ID} не знайдено.`
          );
        }

        const loginRes = await fetch(`${BACKEND}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: testUser.email,
            password: testUser.password,
            lang: i18n.language,
          }),
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) {
          throw new Error(
            loginData.detail ||
              (i18n.language === "ru"
                ? "Не удалось залогинить превью-пользователя."
                : "Не вдалось залогінити превʼю-користувача.")
          );
        }

        const u = loginData.user;

        localStorage.setItem("user_token", "true");
        localStorage.setItem("user_email", u.email);
        if (u.expires_at) localStorage.setItem("expires_at", u.expires_at);
        if (loginData.session_token) {
          localStorage.setItem("session_token", loginData.session_token);
        }

        setPreviewUser(u);
      } catch (err) {
        setPreviewError(err.message || "Preview error");
      } finally {
        setPreviewLoading(false);
        setPreviewInitialized(true);
      }
    };

    if (!previewInitialized && !previewLoading) {
      initPreview();
    }
  }, [previewInitialized, previewLoading, i18n.language]);

  const previewWrapperClass =
    previewMode === "desktop"
      ? "w-full max-w-5xl h-[720px]"
      : previewMode === "tablet"
      ? "w-[820px] max-w-full h-[720px]"
      : "w-[420px] max-w-full h-[760px]";

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <Eye className="w-5 h-5 text-pink-500" />
            {i18n.language === "ru" ? "Как видит сайт ученик" : "Як бачить сайт учень"}
          </h1>
          <p className="text-sm opacity-80 mt-1">
            {i18n.language === "ru"
              ? "Здесь загружается реальный кабинет /profile."
              : "Тут завантажується реальний кабінет /profile."}
          </p>
          {previewUser && (
            <p className="text-xs mt-1 opacity-70">
              {i18n.language === "ru"
                ? `Сейчас превью под: ${previewUser.email}`
                : `Зараз превʼю під: ${previewUser.email}`}
            </p>
          )}
        </div>

        <div
          className={`flex items-center gap-1 rounded-full px-2 py-1 border text-xs sm:text-sm shadow-sm ${
            darkMode
              ? "bg-white/5 border-fuchsia-900/40 text-fuchsia-100"
              : "bg-white/80 border-pink-200 text-gray-700"
          }`}
        >
          <span className="px-2 opacity-70">
            {i18n.language === "ru" ? "Режим:" : "Режим:"}
          </span>

          <button
            onClick={() => setPreviewMode("desktop")}
            className={`flex items-center gap-1 px-2 py-1 rounded-full transition text-xs sm:text-sm ${
              previewMode === "desktop"
                ? darkMode
                  ? "bg-pink-500/80 text-white"
                  : "bg-pink-500 text-white"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            onClick={() => setPreviewMode("tablet")}
            className={`flex items-center gap-1 px-2 py-1 rounded-full transition text-xs sm:text-sm ${
              previewMode === "tablet"
                ? darkMode
                  ? "bg-pink-500/80 text-white"
                  : "bg-pink-500 text-white"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            onClick={() => setPreviewMode("mobile")}
            className={`flex items-center gap-1 px-2 py-1 rounded-full transition text-xs sm:text-sm ${
              previewMode === "mobile"
                ? darkMode
                  ? "bg-pink-500/80 text-white"
                  : "bg-pink-500 text-white"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {previewLoading && (
        <div className="w-full flex justify-center items-center py-12">
          <div className="animate-pulse text-sm opacity-70">
            {i18n.language === "ru"
              ? "Загружаем превью ученика..."
              : "Завантажуємо превʼю учня..."}
          </div>
        </div>
      )}

      {previewError && !previewLoading && (
        <div
          className={`w-full max-w-xl mx-auto text-center text-sm px-4 py-3 rounded-2xl border ${
            darkMode
              ? "border-rose-500/60 text-rose-200 bg-rose-900/20"
              : "border-rose-400 text-rose-700 bg-rose-50"
          }`}
        >
          {previewError}
        </div>
      )}

      {!previewLoading && !previewError && (
        <div className="w-full flex justify-center">
          <div className={`${previewWrapperClass} flex items-center justify-center`}>
            <div
              className={`relative w-full h-full overflow-hidden rounded-3xl shadow-2xl border ${
                darkMode ? "bg-black border-fuchsia-900/50" : "bg-gray-900 border-pink-200/80"
              }`}
            >
              <div
                className={`flex items-center gap-2 px-4 py-2 border-b text-xs ${
                  darkMode
                    ? "border-fuchsia-900/60 bg-black/70 text-fuchsia-100/70"
                    : "border-pink-200/80 bg-gray-50 text-gray-600"
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <span
                    className={`px-3 py-1 rounded-full max-w-[70%] truncate ${
                      darkMode ? "bg-white/5" : "bg-white"
                    }`}
                  >
                    {typeof window !== "undefined"
                      ? window.location.origin
                      : "https://ankstudio.online"}
                    {FRONT_PREVIEW_URL !== "/" ? FRONT_PREVIEW_URL : ""}
                  </span>
                </div>
              </div>

              <iframe
                key={previewUser ? previewUser.email : "preview-iframe"}
                src={FRONT_PREVIEW_URL}
                title="User preview"
                className="w-full h-[calc(100%-40px)] border-0 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// src/pages/admin/TrafficTab.jsx
import { useEffect, useState } from "react";
import { ExternalLink, Link2, Save, BarChart3, ShieldAlert } from "lucide-react";

const BACKEND = "https://anknails-backend-production.up.railway.app";

/**
 * TrafficTab — показує аналітику сайту через публічний embed-URL (iframe).
 * Працює з будь-яким сервісом, який дає public/share URL: Plausible, Umami, Looker Studio тощо.
 * Додатково: якщо реалізуєш бекенд /api/admin/traffic?range=..., картки підхоплять метрики.
 */
export default function TrafficTab({ darkMode, i18n }) {
  const t = (ua, ru) => (i18n.language === "ru" ? ru : ua);

  const [embedUrl, setEmbedUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  // Завантажуємо збережений embed URL (localStorage або з бекенду, якщо захочеш)
  useEffect(() => {
    const saved = localStorage.getItem("analytics_embed_url");
    if (saved) {
      setEmbedUrl(saved);
      setInputUrl(saved);
    }
  }, []);

  // Спроба підтягнути швидкі метрики (опціонально — якщо зробиш такий ендпоінт)
  useEffect(() => {
    let ignore = false;
    const fetchQuickStats = async () => {
      try {
        setLoadingStats(true);
        setError("");

        // ❗ Опціонально: розкоментуй коли реалізуєш бекенд-проксі
        // const r = await fetch(`${BACKEND}/api/admin/traffic?range=7d`);
        // if (!r.ok) throw new Error(`bad status ${r.status}`);
        // const j = await r.json();
        // if (!ignore) setStats(j);

        // Поки бекенд не готовий — просто глушка:
        if (!ignore) {
          setStats(null);
        }
      } catch (e) {
        if (!ignore) {
          setStats(null);
          setError(e.message || "Failed to load stats");
        }
      } finally {
        if (!ignore) setLoadingStats(false);
      }
    };
    fetchQuickStats();
    return () => {
      ignore = true;
    };
  }, []);

  const saveUrl = () => {
    try {
      if (!inputUrl || !/^https?:\/\//i.test(inputUrl)) {
        alert(
          t("Вставте коректний публічний URL дашборду", "Вставьте корректный публичный URL дашборда")
        );
        return;
      }
      localStorage.setItem("analytics_embed_url", inputUrl);
      setEmbedUrl(inputUrl);
    } catch {}
  };

  return (
    <div
      className={`max-w-6xl mx-auto w-full ${
        darkMode ? "text-fuchsia-100" : "text-gray-800"
      }`}
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <BarChart3 className="w-6 h-6 text-pink-500" />
          {t("Відвідуваність сайту", "Посещаемость сайта")}{" "}
          <span className="opacity-60 text-base">ankstudio.online</span>
        </h2>
        {embedUrl && (
          <a
            href={embedUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold
                       bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-[1.02] transition"
          >
            {t("Відкрити дашборд", "Открыть дашборд")}
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Поле для вставки public URL */}
      <div
        className={`p-4 rounded-xl border mb-6 ${
          darkMode ? "border-fuchsia-900/40 bg-[#1a0a1f]/70" : "border-pink-200 bg-white"
        }`}
      >
        <label className="text-sm font-medium flex items-center gap-2 mb-2">
          <Link2 className="w-4 h-4 text-pink-500" />
          {t(
            "Публічний URL вашого аналітичного дашборду (Plausible / Umami / Looker Studio)",
            "Публичный URL вашего аналитического дашборда (Plausible / Umami / Looker Studio)"
          )}
        </label>
        <div className="flex gap-2">
          <input
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://plausible.io/share/ankstudio.online?auth=... або посилання Looker Studio"
            className={`flex-1 rounded-lg px-3 py-2 text-sm outline-none
                       ${darkMode ? "bg-[#140a17] border border-fuchsia-900/40" : "bg-pink-50 border border-pink-200"}`}
          />
          <button
            onClick={saveUrl}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                       bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-[1.02] transition"
          >
            <Save className="w-4 h-4" />
            {t("Зберегти", "Сохранить")}
          </button>
        </div>

        {!embedUrl && (
          <div className="mt-3 flex items-start gap-2 text-xs opacity-80">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              {t(
                "Потрібне публічне посилання з вашого сервісу аналітики. У Plausible відкрийте Site → Share → Enable public dashboard і скопіюйте посилання. В Umami — Enable Share Link.",
                "Нужна публичная ссылка из вашего сервиса аналитики. В Plausible откройте Site → Share → Enable public dashboard и скопируйте ссылку. В Umami — Enable Share Link."
              )}
            </p>
          </div>
        )}
      </div>

      {/* Швидкі метрики (опціонально) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {["today", "7d", "30d"].map((range) => (
          <div
            key={range}
            className={`rounded-xl p-4 border ${
              darkMode ? "border-fuchsia-900/40 bg-[#1a0a1f]/70" : "border-pink-200 bg-white"
            }`}
          >
            <p className="text-xs opacity-70 mb-1 uppercase tracking-wide">
              {range === "today"
                ? t("Сьогодні", "Сегодня")
                : range === "7d"
                ? t("Останні 7 днів", "Последние 7 дней")
                : t("Останні 30 днів", "Последние 30 дней")}
            </p>
            <p className="text-3xl font-extrabold text-pink-500">
              {loadingStats ? "…" : stats?.[range]?.visits ?? "—"}
            </p>
            <p className="text-xs opacity-70">
              {t("візити", "визиты")}
            </p>
          </div>
        ))}
      </div>

      {/* Вбудований дашборд */}
      {embedUrl ? (
        <div
          className={`rounded-xl overflow-hidden border ${
            darkMode ? "border-fuchsia-900/40" : "border-pink-200"
          }`}
          style={{ height: "70vh" }}
        >
          <iframe
            src={embedUrl}
            title="Analytics Dashboard"
            className="w-full h-full"
            allow="clipboard-write; fullscreen"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        <div
          className={`rounded-xl p-8 text-center border ${
            darkMode ? "border-fuchsia-900/40 bg-[#1a0a1f]/70" : "border-pink-200 bg-white"
          }`}
        >
          <p className="text-sm opacity-80">
            {t(
              "Вставте публічний URL аналітики, щоб побачити дашборд у цьому вікні.",
              "Вставьте публичный URL аналитики, чтобы увидеть дашборд в этом окне."
            )}
          </p>
        </div>
      )}

      {error && (
        <p className="mt-3 text-xs text-rose-500">
          {t("Помилка завантаження метрик:", "Ошибка загрузки метрик:")} {error}
        </p>
      )}
    </div>
  );
}

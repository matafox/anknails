// src/pages/admin/TrafficTab.jsx
import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Link2,
  Save,
  BarChart3,
  ShieldAlert,
  Fingerprint,
  Copy,
  Send,
  CheckCircle2,
} from "lucide-react";

const BACKEND = "https://anknails-backend-production.up.railway.app";

export default function TrafficTab({ darkMode, i18n }) {
  const t = (ua, ru) => (i18n.language === "ru" ? ru : ua);

  const [embedUrl, setEmbedUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [gaId, setGaId] = useState("");
  const [inputGa, setInputGa] = useState("");
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [testSent, setTestSent] = useState(false);

  // === load saved ===
  useEffect(() => {
    const savedUrl = localStorage.getItem("analytics_embed_url") || "";
    const savedGa = localStorage.getItem("ga_measurement_id") || "";
    if (savedUrl) {
      setEmbedUrl(savedUrl);
      setInputUrl(savedUrl);
    }
    if (savedGa) {
      setGaId(savedGa);
      setInputGa(savedGa);
    }
  }, []);

  // === optional quick stats placeholder ===
  useEffect(() => {
    let ignore = false;
    const run = async () => {
      try {
        setLoadingStats(true);
        setError("");
        // Опціонально: коли зробиш бекенд-проксі — розкоментуй
        // const r = await fetch(`${BACKEND}/api/admin/traffic?range=7d`);
        // if (!r.ok) throw new Error(`bad status ${r.status}`);
        // const j = await r.json();
        // if (!ignore) setStats(j);
        if (!ignore) setStats(null);
      } catch (e) {
        if (!ignore) {
          setStats(null);
          setError(e.message || "Failed to load stats");
        }
      } finally {
        if (!ignore) setLoadingStats(false);
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, []);

  // === validators ===
  const isHttpUrl = (s = "") => /^https?:\/\//i.test(s);
  const isGaId = (s = "") => /^G-[A-Z0-9]+$/i.test(s.trim());

  // === save handlers ===
  const saveUrl = () => {
    if (!inputUrl || !isHttpUrl(inputUrl)) {
      alert(
        t(
          "Вставте коректний публічний URL дашборду",
          "Вставьте корректный публичный URL дашборда"
        )
      );
      return;
    }
    localStorage.setItem("analytics_embed_url", inputUrl.trim());
    setEmbedUrl(inputUrl.trim());
  };

  const saveGa = () => {
    if (!isGaId(inputGa)) {
      alert(
        t(
          "Введіть валідний GA4 Measurement ID у форматі G-XXXXXXX",
          "Введите валидный GA4 Measurement ID в формате G-XXXXXXX"
        )
      );
      return;
    }
    localStorage.setItem("ga_measurement_id", inputGa.trim().toUpperCase());
    setGaId(inputGa.trim().toUpperCase());
  };

  // === generated GA snippet ===
  const gaSnippet = useMemo(() => {
    if (!isGaId(gaId)) return "";
    const id = gaId.toUpperCase();
    return [
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>`,
      `<script>`,
      `  window.dataLayer = window.dataLayer || [];`,
      `  function gtag(){dataLayer.push(arguments);}`,
      `  gtag('js', new Date());`,
      `  gtag('config', '${id}', { send_page_view: true });`,
      `</script>`,
    ].join("\n");
  }, [gaId]);

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(gaSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  // === test ping: inject gtag on this page and send event ===
  const sendTestEvent = async () => {
    try {
      if (!isGaId(gaId)) return;
      const id = gaId.toUpperCase();

      // inject script only once
      if (!document.querySelector(`#gtag-js-${id}`)) {
        const s = document.createElement("script");
        s.id = `gtag-js-${id}`;
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
        document.head.appendChild(s);
      }

      if (!window.dataLayer) window.dataLayer = [];
      window.gtag =
        window.gtag ||
        function () {
          window.dataLayer.push(arguments);
        };

      window.gtag("js", new Date());
      window.gtag("config", id, { send_page_view: false });

      // page_view для адмінки
      window.gtag("event", "page_view", {
        page_title: "Admin TrafficTab",
        page_location: window.location.href,
      });

      // додатковий тестовий івент
      window.gtag("event", "tutorial_event", {
        method: "TrafficTab test",
      });

      setTestSent(true);
      setTimeout(() => setTestSent(false), 1500);
      alert(
        t(
          "Тестова подія відправлена. Перевір у GA4 → Reports → Realtime.",
          "Тестовое событие отправлено. Проверь в GA4 → Reports → Realtime."
        )
      );
    } catch (e) {
      alert(t("Не вдалося надіслати подію", "Не удалось отправить событие"));
    }
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

      {/* === Блок 1: Вставка публічного URL дашборду === */}
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
            placeholder="https://plausible.io/share/ankstudio.online?... або посилання Looker Studio"
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
                "Потрібне публічне посилання з вашого сервісу аналітики. У Plausible відкрийте Site → Share → Enable public dashboard. В Umami — Enable Share Link. У Looker Studio — Share → Anyone with the link + Embed report.",
                "Нужна публичная ссылка из вашего сервиса аналитики. В Plausible откройте Site → Share → Enable public dashboard. В Umami — Enable Share Link. В Looker Studio — Share → Anyone with the link + Embed report."
              )}
            </p>
          </div>
        )}
      </div>

      {/* === Блок 2: Введення GA4 Measurement ID (G-XXXX) === */}
      <div
        className={`p-4 rounded-xl border mb-6 ${
          darkMode ? "border-fuchsia-900/40 bg-[#0f0a1a]" : "border-pink-200 bg-white"
        }`}
      >
        <label className="text-sm font-medium flex items-center gap-2 mb-2">
          <Fingerprint className="w-4 h-4 text-pink-500" />
          GA4 Measurement ID
        </label>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={inputGa}
            onChange={(e) => setInputGa(e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className={`flex-1 rounded-lg px-3 py-2 text-sm outline-none
                        ${darkMode ? "bg-[#140a17] border border-fuchsia-900/40" : "bg-pink-50 border border-pink-200"}`}
          />
          <button
            onClick={saveGa}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                       bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-[1.02] transition"
          >
            <Save className="w-4 h-4" />
            {t("Зберегти ID", "Сохранить ID")}
          </button>
        </div>

        {/* Генеруємо код і тестові інструменти */}
        {isGaId(gaId) && (
          <div className="mt-4">
            <p className="text-xs opacity-80 mb-2">
              {t(
                "Скопіюй цей код у <head> на всіх сторінках сайту.",
                "Скопируй этот код в <head> на всех страницах сайта."
              )}
            </p>

            <pre
              className={`rounded-lg p-3 text-xs overflow-x-auto select-all ${
                darkMode ? "bg-[#140a17] border border-fuchsia-900/40" : "bg-pink-50 border border-pink-200"
              }`}
            >
{gaSnippet}
            </pre>

            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={copySnippet}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold
                           border border-pink-300 text-pink-600 hover:bg-pink-50 dark:border-fuchsia-800 dark:text-fuchsia-200"
              >
                <Copy className="w-4 h-4" />
                {copied ? t("Скопійовано", "Скопировано") : t("Скопіювати код", "Скопировать код")}
              </button>

              <button
                onClick={sendTestEvent}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold
                           bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-[1.02] transition"
              >
                {testSent ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                {testSent
                  ? t("Надіслано", "Отправлено")
                  : t("Надіслати тест-подію", "Отправить тест-событие")}
              </button>
            </div>

            <p className="mt-2 text-xs opacity-80">
              {t(
                "Після натискання перевір у GA4: Reports → Realtime (має зʼявитись ваш візит та подія).",
                "После нажатия проверь в GA4: Reports → Realtime (должен появиться визит и событие)."
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
            <p className="text-xs opacity-70">{t("візити", "визиты")}</p>
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
              "Вставте публічний URL дашборду або введіть GA4 ID (G-XXXX) вище.",
              "Вставьте публичный URL дашборда или введите GA4 ID (G-XXXX) выше."
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

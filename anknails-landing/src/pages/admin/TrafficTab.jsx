// src/pages/admin/TrafficTab.jsx
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Save,
  Fingerprint,
  Copy,
  Send,
  CheckCircle2,
  Activity,
  Globe2,
  Building2,
  Smartphone,
  Share2,
} from "lucide-react";

const BACKEND = "https://anknails-backend-production.up.railway.app";

export default function TrafficTab({ darkMode, i18n }) {
  const t = (ua, ru) => (i18n?.language === "ru" ? ru : ua);

  const [gaId, setGaId] = useState("");
  const [inputGa, setInputGa] = useState("");
  const [activeUsers, setActiveUsers] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [loadingRealtime, setLoadingRealtime] = useState(false);

  const [topCountries, setTopCountries] = useState([]);
  const [topCities, setTopCities] = useState([]);
  const [topDevices, setTopDevices] = useState([]);
  const [topSources, setTopSources] = useState([]);

  const isGaId = (s = "") => /^G-[A-Z0-9]+$/i.test((s || "").trim());

  // 1) Підтягуємо конфіг із бекенду
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const r = await fetch(`${BACKEND}/api/admin/ga/config`);
        if (!r.ok) throw new Error(`status ${r.status}`);
        const j = await r.json();
        if (!ignore && j?.measurement_id) {
          setGaId(j.measurement_id);
          setInputGa(j.measurement_id);
        }
      } catch {}
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // 2) Зберігаємо GA ID на бекенд
  const saveGa = async () => {
    if (!isGaId(inputGa)) {
      alert(
        t(
          "Введіть валідний GA4 Measurement ID у форматі G-XXXXXXX",
          "Введите валидный GA4 Measurement ID в формате G-XXXXXXX"
        )
      );
      return;
    }
    try {
      const r = await fetch(`${BACKEND}/api/admin/ga/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          measurement_id: inputGa.trim().toUpperCase(),
          token: localStorage.getItem("admin_secret") || "ank_local",
        }),
      });
      if (!r.ok) throw new Error(`status ${r.status}`);
      setGaId(inputGa.trim().toUpperCase());
    } catch (e) {
      alert(t("Не вдалося зберегти GA ID", "Не удалось сохранить GA ID"));
    }
  };

  // 3) Сніпет для <head>
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
    if (!gaSnippet) return;
    try {
      await navigator.clipboard.writeText(gaSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  // 4) Тест-подія
  const sendTestEvent = async () => {
    if (!isGaId(gaId)) {
      alert(t("Спершу збережіть коректний GA ID", "Сначала сохраните корректный GA ID"));
      return;
    }
    try {
      const r = await fetch(`${BACKEND}/api/admin/ga/send-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!r.ok) throw new Error(`status ${r.status}`);
      setTestSent(true);
      setTimeout(() => setTestSent(false), 1500);
      alert(t("Тестова подія відправлена. Перевір Realtime у GA4.", "Тестовое событие отправлено. Проверь Realtime в GA4."));
    } catch (e) {
      alert(t("Не вдалося надіслати подію (перевір API Secret на бекенді).", "Не удалось отправить событие (проверь API Secret на бэкенде)."));
    }
  };

  // 5) Realtime + розкладки
  const fetchOverview = async () => {
    try {
      setLoadingRealtime(true);
      setError("");
      const r = await fetch(`${BACKEND}/api/admin/ga/overview`);
      if (!r.ok) throw new Error(`status ${r.status}`);
      const j = await r.json();
      setActiveUsers(typeof j?.activeUsers === "number" ? j.activeUsers : null);
      setTopCountries(j?.topCountries || []);
      setTopCities(j?.topCities || []);
      setTopDevices(j?.topDevices || []);
      setTopSources(j?.topSources || []);
    } catch (e) {
      setError(e.message || "Failed");
      setActiveUsers(null);
      setTopCountries([]);
      setTopCities([]);
      setTopDevices([]);
      setTopSources([]);
    } finally {
      setLoadingRealtime(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    const id = setInterval(fetchOverview, 10000);
    return () => clearInterval(id);
  }, []);

  const cardClass = `rounded-xl p-5 border ${
    darkMode ? "border-fuchsia-900/40 bg-[#1a0a1f]/70" : "border-pink-200 bg-white"
  }`;

  const tableClass =
    "w-full text-sm border-separate border-spacing-y-2";

  const headerCell =
    "text-xs uppercase opacity-60 pb-1";

  const rowCell =
    "py-2 px-0";

  return (
    <div className={`max-w-6xl mx-auto w-full ${darkMode ? "text-fuchsia-100" : "text-gray-800"}`}>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <BarChart3 className="w-6 h-6 text-pink-500" />
          {t("Відвідуваність сайту", "Посещаемость сайта")}{" "}
          <span className="opacity-60 text-base">ankstudio.online</span>
        </h2>
      </div>

      {/* GA ID */}
      <div className={`p-4 rounded-xl border mb-6 ${darkMode ? "border-fuchsia-900/40 bg-[#0f0a1a]" : "border-pink-200 bg-white"}`}>
        <label className="text-sm font-medium flex items-center gap-2 mb-2">
          <Fingerprint className="w-4 h-4 text-pink-500" />
          GA4 Measurement ID
        </label>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={inputGa}
            onChange={(e) => setInputGa(e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className={`flex-1 rounded-lg px-3 py-2 text-sm outline-none ${
              darkMode ? "bg-[#140a17] border border-fuchsia-900/40" : "bg-pink-50 border border-pink-200"
            }`}
          />
          <button
            onClick={saveGa}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-[1.02] transition"
          >
            <Save className="w-4 h-4" />
            {t("Зберегти ID", "Сохранить ID")}
          </button>
        </div>

        {isGaId(gaId) && (
          <div className="mt-4">
            <p className="text-xs opacity-80 mb-2">
              {t("Швидкий код для вставки у <head> (за потреби).", "Быстрый код для вставки в <head> (при необходимости).")}
            </p>
            <pre className={`rounded-lg p-3 text-xs overflow-x-auto select-all ${
              darkMode ? "bg-[#140a17] border border-fuchsia-900/40" : "bg-pink-50 border border-pink-200"
            }`}>
{gaSnippet}
            </pre>

            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={copySnippet}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-pink-300 text-pink-600 hover:bg-pink-50 dark:border-fuchsia-800 dark:text-fuchsia-200"
              >
                <Copy className="w-4 h-4" />
                {copied ? t("Скопійовано", "Скопировано") : t("Скопіювати код", "Скопировать код")}
              </button>

              <button
                onClick={sendTestEvent}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-[1.02] transition"
              >
                {testSent ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                {testSent ? t("Надіслано", "Отправлено") : t("Надіслати тест-подію", "Отправить тест-событие")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Realtime + розкладки */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active users */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-pink-500" />
            <p className="text-sm font-semibold">
              {t("Активні користувачі (Realtime)", "Активные пользователи (Realtime)")}
            </p>
          </div>
          <p className="text-4xl font-extrabold text-pink-500">
            {loadingRealtime ? "…" : activeUsers ?? "—"}
          </p>
          {!!error && (
            <p className="mt-2 text-xs text-rose-500">
              {t("Помилка:", "Ошибка:")} {error}
            </p>
          )}
        </div>

        {/* Топ девайсів */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-5 h-5 text-pink-500" />
            <p className="text-sm font-semibold">{t("Топ девайсів", "Топ устройств")}</p>
          </div>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={headerCell}>{t("Девайс", "Устройство")}</th>
                <th className={headerCell} style={{textAlign:"right"}}>Users</th>
              </tr>
            </thead>
            <tbody>
              {topDevices.map((r, i) => (
                <tr key={i} className="hover:opacity-90">
                  <td className={rowCell}>{r.name}</td>
                  <td className={rowCell} style={{textAlign:"right"}}>{r.activeUsers}</td>
                </tr>
              ))}
              {!topDevices.length && (
                <tr><td className={rowCell} colSpan={2} style={{opacity:0.6}}>{t("Немає даних", "Нет данных")}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Топ країн */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-3">
            <Globe2 className="w-5 h-5 text-pink-500" />
            <p className="text-sm font-semibold">{t("Топ країн", "Топ стран")}</p>
          </div>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={headerCell}>{t("Країна", "Страна")}</th>
                <th className={headerCell} style={{textAlign:"right"}}>Users</th>
              </tr>
            </thead>
            <tbody>
              {topCountries.map((r, i) => (
                <tr key={i} className="hover:opacity-90">
                  <td className={rowCell}>{r.name}</td>
                  <td className={rowCell} style={{textAlign:"right"}}>{r.activeUsers}</td>
                </tr>
              ))}
              {!topCountries.length && (
                <tr><td className={rowCell} colSpan={2} style={{opacity:0.6}}>{t("Немає даних", "Нет данных")}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Топ міст */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-pink-500" />
            <p className="text-sm font-semibold">{t("Топ міст", "Топ городов")}</p>
          </div>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={headerCell}>{t("Місто", "Город")}</th>
                <th className={headerCell} style={{textAlign:"right"}}>Users</th>
              </tr>
            </thead>
            <tbody>
              {topCities.map((r, i) => (
                <tr key={i} className="hover:opacity-90">
                  <td className={rowCell}>{r.name}</td>
                  <td className={rowCell} style={{textAlign:"right"}}>{r.activeUsers}</td>
                </tr>
              ))}
              {!topCities.length && (
                <tr><td className={rowCell} colSpan={2} style={{opacity:0.6}}>{t("Немає даних", "Нет данных")}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Топ джерел */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="w-5 h-5 text-pink-500" />
            <p className="text-sm font-semibold">{t("Топ джерел", "Топ источников")}</p>
          </div>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={headerCell}>{t("Джерело", "Источник")}</th>
                <th className={headerCell} style={{textAlign:"right"}}>Users</th>
              </tr>
            </thead>
            <tbody>
              {topSources.map((r, i) => (
                <tr key={i} className="hover:opacity-90">
                  <td className={rowCell}>{r.name}</td>
                  <td className={rowCell} style={{textAlign:"right"}}>{r.activeUsers}</td>
                </tr>
              ))}
              {!topSources.length && (
                <tr><td className={rowCell} colSpan={2} style={{opacity:0.6}}>{t("Немає даних", "Нет данных")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// src/pages/admin/TrafficTab.jsx
import { useEffect, useState } from "react";
import {
  BarChart3,
  Save,
  Fingerprint,
  Send,
  CheckCircle2,
  Activity,
  Globe2,
  Building2,
  Smartphone,
} from "lucide-react";

const BACKEND = "https://anknails-backend-production.up.railway.app";

export default function TrafficTab({ darkMode, i18n }) {
  const t = (ua, ru) => (i18n?.language === "ru" ? ru : ua);

  const [gaId, setGaId] = useState("");
  const [inputGa, setInputGa] = useState("");

  const [activeUsers, setActiveUsers] = useState(null);
  const [error, setError] = useState("");
  const [testSent, setTestSent] = useState(false);
  const [loadingRealtime, setLoadingRealtime] = useState(false);

  const [topCountries, setTopCountries] = useState([]);
  const [topCities, setTopCities] = useState([]);
  const [topDevices, setTopDevices] = useState([]);

  // ⚡ Швидкі періоди (24h / 3d / 7d / 30d)
  const [quick, setQuick] = useState({ d1: null, d3: null, d7: null, d30: null });
  const [loadingQuick, setLoadingQuick] = useState(false);

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

  // 3) Відправити тест-подію (через MP)
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

  // 4) Realtime + розкладки
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
    } catch (e) {
      setError(e.message || "Failed");
      setActiveUsers(null);
      setTopCountries([]);
      setTopCities([]);
      setTopDevices([]);
    } finally {
      setLoadingRealtime(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    const id = setInterval(fetchOverview, 10000);
    return () => clearInterval(id);
  }, []);

  // 5) Швидкі періоди (1 / 3 / 7 / 30 днів)
  const fetchQuick = async () => {
    try {
      setLoadingQuick(true);
      const r = await fetch(`${BACKEND}/api/admin/ga/summary?windows=1,3,7,30`);
      if (!r.ok) throw new Error(`status ${r.status}`);
      const j = await r.json();

      // Нормалізація різних форматів
      let d1, d3, d7, d30;

      if (Array.isArray(j)) {
        const byDays = Object.fromEntries(
          j.map((x) => [String(x.days), Number(x.users) || 0])
        );
        d1 = byDays["1"]; d3 = byDays["3"]; d7 = byDays["7"]; d30 = byDays["30"];
      } else if (j?.windows && typeof j.windows === "object") {
        d1 = Number(j.windows["1"] ?? j.windows["d1"]) || 0;
        d3 = Number(j.windows["3"] ?? j.windows["d3"]) || 0;
        d7 = Number(j.windows["7"] ?? j.windows["d7"]) || 0;
        d30 = Number(j.windows["30"] ?? j.windows["d30"]) || 0;
      } else {
        d1 = Number(j["1"] ?? j.d1) || 0;
        d3 = Number(j["3"] ?? j.d3) || 0;
        d7 = Number(j["7"] ?? j.d7) || 0;
        d30 = Number(j["30"] ?? j.d30) || 0;
      }

      setQuick({ d1, d3, d7, d30 });
    } catch (e) {
      setQuick({ d1: null, d3: null, d7: null, d30: null });
    } finally {
      setLoadingQuick(false);
    }
  };

  useEffect(() => {
    fetchQuick();
  }, []);

  const cardClass = `rounded-xl p-5 border ${
    darkMode ? "border-fuchsia-900/40 bg-[#1a0a1f]/70" : "border-pink-200 bg-white"
  }`;

  const tableClass = "w-full text-sm border-separate border-spacing-y-2";
  const headerCell = "text-xs uppercase opacity-60 pb-1";
  const rowCell = "py-2 px-0";

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

      {/* GA ID + дії */}
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
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={sendTestEvent}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-[1.02] transition"
            >
              {testSent ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              {testSent ? t("Надіслано", "Отправлено") : t("Надіслати тест-подію", "Отправить тест-событие")}
            </button>
          </div>
        )}
      </div>

      {/* Realtime + розкладки (без "Топ джерел") */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active users */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-pink-500" />
            <p className="text-sm font-semibold">
              {t("Активні користувачі (Наживо)", "Активные пользователи (Наживо)")}
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
                <th className={headerCell} style={{ textAlign: "right" }}>Users</th>
              </tr>
            </thead>
            <tbody>
              {topDevices.map((r, i) => (
                <tr key={i} className="hover:opacity-90">
                  <td className={rowCell}>{r.name}</td>
                  <td className={rowCell} style={{ textAlign: "right" }}>{r.activeUsers}</td>
                </tr>
              ))}
              {!topDevices.length && (
                <tr><td className={rowCell} colSpan={2} style={{ opacity: 0.6 }}>{t("Немає даних", "Нет данных")}</td></tr>
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
                <th className={headerCell} style={{ textAlign: "right" }}>Users</th>
              </tr>
            </thead>
            <tbody>
              {topCountries.map((r, i) => (
                <tr key={i} className="hover:opacity-90">
                  <td className={rowCell}>{r.name}</td>
                  <td className={rowCell} style={{ textAlign: "right" }}>{r.activeUsers}</td>
                </tr>
              ))}
              {!topCountries.length && (
                <tr><td className={rowCell} colSpan={2} style={{ opacity: 0.6 }}>{t("Немає даних", "Нет данных")}</td></tr>
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
                <th className={headerCell} style={{ textAlign: "right" }}>Users</th>
              </tr>
            </thead>
            <tbody>
              {topCities.map((r, i) => (
                <tr key={i} className="hover:opacity-90">
                  <td className={rowCell}>{r.name}</td>
                  <td className={rowCell} style={{ textAlign: "right" }}>{r.activeUsers}</td>
                </tr>
              ))}
              {!topCities.length && (
                <tr><td className={rowCell} colSpan={2} style={{ opacity: 0.6 }}>{t("Немає даних", "Нет данных")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ⚡ Швидкі періоди: 24 год / 3 дні / 7 днів / 30 днів */}
      <div className={`mt-6 ${cardClass}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-pink-500" />
            {t("Перегляди за періоди", "Просмотры за периоды")}
          </p>
          <button
            onClick={fetchQuick}
            className="text-xs px-3 py-1 rounded-lg border border-pink-300 hover:bg-pink-50 dark:border-fuchsia-800"
          >
            {t("Оновити", "Обновить")}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { labelUa: "24 години", labelRu: "24 часа", val: quick.d1 },
            { labelUa: "3 дні", labelRu: "3 дня", val: quick.d3 },
            { labelUa: "7 днів", labelRu: "7 дней", val: quick.d7 },
            { labelUa: "30 днів", labelRu: "30 дней", val: quick.d30 },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-4 border ${
                darkMode ? "border-fuchsia-900/30 bg-[#120a16]" : "border-pink-200 bg-pink-50"
              }`}
            >
              <p className="text-xs opacity-70 mb-1">{t(item.labelUa, item.labelRu)}</p>
              <p className="text-2xl font-extrabold text-pink-500">
                {loadingQuick ? "…" : (item.val ?? "—")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

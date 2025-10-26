import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, Gift } from "lucide-react";

export default function EarningsTab({ i18n, darkMode }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(false);

  // 💰 Завантаження заробітку (тимчасово — мокові дані)
  useEffect(() => {
    const loadEarnings = async () => {
      try {
        setLoading(true);

        // ❗ Можеш замінити на реальний бекенд-запит, коли зробиш ендпоінт
        // const res = await fetch(`${BACKEND}/api/earnings`);
        // const data = await res.json();
        // setEarnings(data.earnings || []);

        // 🔹 Тимчасово: демо-дані
        setTimeout(() => {
          setEarnings([
            { id: 1, type: "income", amount: 150, date: "2025-10-21" },
            { id: 2, type: "bonus", amount: 50, date: "2025-10-23" },
            { id: 3, type: "income", amount: 200, date: "2025-10-25" },
          ]);
          setLoading(false);
        }, 700);
      } catch (err) {
        console.error("Помилка завантаження заробітку:", err);
        setLoading(false);
      }
    };

    loadEarnings();
  }, []);

  return (
    <section
      className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 ${
        darkMode
          ? "border-fuchsia-900/30 bg-[#1a0a1f]/60 text-fuchsia-100"
          : "border-pink-200 bg-white/70 text-gray-800"
      }`}
    >
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-pink-500" />
        {i18n.language === "ru" ? "Заработок" : "Заробіток"}
      </h2>

      {loading ? (
        <p className="opacity-70">
          {i18n.language === "ru" ? "Загрузка данных..." : "Завантаження даних..."}
        </p>
      ) : earnings.length > 0 ? (
        <table
          className={`min-w-[700px] w-full rounded-xl overflow-hidden border ${
            darkMode ? "border-fuchsia-900/30" : "border-pink-200"
          }`}
        >
          <thead className={darkMode ? "bg-fuchsia-950/40" : "bg-pink-100"}>
            <tr>
              <th className="py-2 px-3 text-left">ID</th>
              <th className="py-2 px-3 text-left">
                {i18n.language === "ru" ? "Тип" : "Тип"}
              </th>
              <th className="py-2 px-3 text-left">
                {i18n.language === "ru" ? "Сумма" : "Сума"}
              </th>
              <th className="py-2 px-3 text-left">
                {i18n.language === "ru" ? "Дата" : "Дата"}
              </th>
            </tr>
          </thead>
          <tbody>
            {earnings.map((e) => (
              <tr
                key={e.id}
                className={`border-t ${
                  darkMode
                    ? "border-fuchsia-900/30 hover:bg-fuchsia-950/30"
                    : "border-pink-200 hover:bg-pink-50"
                }`}
              >
                <td className="py-2 px-3">{e.id}</td>
                <td className="py-2 px-3 flex items-center gap-2">
                  {e.type === "bonus" ? (
                    <Gift className="w-4 h-4 text-green-400" />
                  ) : (
                    <DollarSign className="w-4 h-4 text-pink-500" />
                  )}
                  {i18n.language === "ru"
                    ? e.type === "bonus"
                      ? "Бонус"
                      : "Доход"
                    : e.type === "bonus"
                    ? "Бонус"
                    : "Дохід"}
                </td>
                <td className="py-2 px-3 font-semibold">{e.amount} PLN</td>
                <td className="py-2 px-3 opacity-80">
                  {new Date(e.d

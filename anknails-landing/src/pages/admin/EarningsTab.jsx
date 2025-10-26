import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, User } from "lucide-react";

export default function EarningsTab({ i18n, darkMode }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [goal, setGoal] = useState(1000); // 🎯 ціль по доходу

  // 🧠 Початкові мок-дані
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // можеш потім замінити на бекенд:
        // const res = await fetch(`${BACKEND}/api/earnings`);
        // const data = await res.json();
        // setEarnings(data.earnings);
        setTimeout(() => {
          setEarnings([
            { id: 1, name: "Анна Осипова", amount: 250 },
            { id: 2, name: "Марія Коваль", amount: 150 },
            { id: 3, name: "Олена Сидоренко", amount: 0 },
          ]);
          setLoading(false);
        }, 400);
      } catch (err) {
        console.error("Помилка завантаження:", err);
        setLoading(false);
      }
    };
    load();
  }, []);

  // 🔢 Підрахунок суми
  useEffect(() => {
    const totalSum = earnings.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    setTotal(totalSum);
  }, [earnings]);

  // ✏️ Зміна суми вручну
  const handleAmountChange = (id, value) => {
    const updated = earnings.map((e) =>
      e.id === id ? { ...e, amount: Number(value) || 0 } : e
    );
    setEarnings(updated);
  };

  const progress = Math.min((total / goal) * 100, 100);

  return (
    <section
      className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 ${
        darkMode
          ? "border-fuchsia-900/30 bg-[#1a0a1f]/60 text-fuchsia-100"
          : "border-pink-200 bg-white/70 text-gray-800"
      }`}
    >
      {/* 🏆 Заголовок */}
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-pink-500" />
        {i18n.language === "ru" ? "Заработок" : "Заробіток"}
      </h2>

      {/* 📈 Загальний прогрес */}
      <div className="mb-6">
        <div className="flex justify-between mb-2 text-sm">
          <span>
            {i18n.language === "ru" ? "Общий доход:" : "Загальний дохід:"}{" "}
            <strong>{total} PLN</strong>
          </span>
          <span>
            {i18n.language === "ru" ? "Цель:" : "Ціль:"} {goal} PLN
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-pink-200 dark:bg-fuchsia-900/40 overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* 📋 Таблиця */}
      {loading ? (
        <p className="opacity-70">
          {i18n.language === "ru" ? "Загрузка данных..." : "Завантаження даних..."}
        </p>
      ) : (
        <table
          className={`min-w-[700px] w-full rounded-xl overflow-hidden border ${
            darkMode ? "border-fuchsia-900/30" : "border-pink-200"
          }`}
        >
          <thead className={darkMode ? "bg-fuchsia-950/40" : "bg-pink-100"}>
            <tr>
              <th className="py-2 px-3 text-left">#</th>
              <th className="py-2 px-3 text-left">
                {i18n.language === "ru" ? "Пользователь" : "Користувач"}
              </th>
              <th className="py-2 px-3 text-left">
                {i18n.language === "ru" ? "Сумма (PLN)" : "Сума (PLN)"}
              </th>
            </tr>
          </thead>
          <tbody>
            {earnings.map((e, i) => (
              <tr
                key={e.id}
                className={`border-t ${
                  darkMode
                    ? "border-fuchsia-900/30 hover:bg-fuchsia-950/30"
                    : "border-pink-200 hover:bg-pink-50"
                }`}
              >
                <td className="py-2 px-3">{i + 1}</td>
                <td className="py-2 px-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-500" />
                  {e.name}
                </td>
                <td className="py-2 px-3">
                  <input
                    type="number"
                    value={e.amount}
                    onChange={(ev) => handleAmountChange(e.id, ev.target.value)}
                    className={`px-3 py-2 w-32 rounded-lg text-sm font-semibold border outline-none text-center transition-all ${
                      darkMode
                        ? "bg-fuchsia-950/40 border-fuchsia-800/40 text-fuchsia-100 focus:border-pink-400"
                        : "bg-white border-pink-300 focus:border-pink-500"
                    }`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

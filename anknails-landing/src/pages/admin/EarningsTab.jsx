import { useEffect, useState } from "react";
import { CreditCard, User, BookOpen } from "lucide-react";

export default function EarningsTab({ i18n, darkMode }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";
  const [users, setUsers] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // 🧠 Завантаження користувачів з бекенду
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/users`);
      const data = await res.json();

      const mapped = (data.users || []).map((u) => ({
        id: u.id,
        name: u.name || u.email || "Без імені",
        course: u.course_title || (i18n.language === "ru" ? "Без курса" : "Без курсу"),
        amount: 0,
      }));
      setUsers(mapped);
      setEarnings(mapped);
    } catch (err) {
      console.error("Помилка завантаження користувачів:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 🔢 Підрахунок загальної суми
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

  return (
    <section
      className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 ${
        darkMode
          ? "border-fuchsia-900/30 bg-[#1a0a1f]/60 text-fuchsia-100"
          : "border-pink-200 bg-white/70 text-gray-800"
      }`}
    >
      {/* 🏦 Заголовок */}
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <CreditCard className="w-6 h-6 text-pink-500" />
        {i18n.language === "ru" ? "История платежей" : "Історія платежів"}
      </h2>

      {/* 💰 Загальний дохід */}
      <div className="mb-6 text-lg font-medium">
        {i18n.language === "ru" ? "Общий доход:" : "Загальний дохід:"}{" "}
        <span className="text-pink-500 font-bold">{total} PLN</span>
      </div>

      {/* 📋 Таблиця */}
      {loading ? (
        <p className="opacity-70">
          {i18n.language === "ru" ? "Загрузка данных..." : "Завантаження даних..."}
        </p>
      ) : users.length > 0 ? (
        <table
          className={`min-w-[800px] w-full rounded-xl overflow-hidden border ${
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
                {i18n.language === "ru" ? "Курс" : "Курс"}
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
                <td className="py-2 px-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-fuchsia-400" />
                  <span>{e.course}</span>
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
      ) : (
        <p className="opacity-70">
          {i18n.language === "ru"
            ? "Пользователи не найдены"
            : "Користувачів ще немає"}
        </p>
      )}
    </section>
  );
}

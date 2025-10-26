import { useEffect, useState, useRef, useMemo } from "react";
import { CreditCard, User, BookOpen } from "lucide-react";

export default function EarningsTab({ i18n, darkMode }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // 🧠 Завантаження користувачів
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/users`);
      const data = await res.json();
      setUsers(
        (data.users || []).map((u) => ({
          id: u.id,
          name: u.name || u.email || "Без імені",
          course:
            u.course_title ||
            (i18n.language === "ru" ? "Без курса" : "Без курсу"),
          amount: "",
        }))
      );
    } catch (err) {
      console.error("Помилка завантаження користувачів:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ✏️ Зміна суми (автозбереження)
  const handleAmountChange = (id, value) => {
    const updatedUsers = users.map((u) =>
      u.id === id ? { ...u, amount: value === "" ? "" : Number(value) } : u
    );
    setUsers(updatedUsers);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const user = updatedUsers.find((u) => u.id === id);
      if (user && user.amount !== "") savePayment(user);
    }, 500);
  };

  // 💾 Збереження оплати
  const savePayment = async (user) => {
    try {
      await fetch(`${BACKEND}/api/payments/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name: user.name,
          course: user.course,
          amount: user.amount,
        }),
      });
      console.log("✅ Saved payment for:", user.name);
    } catch (err) {
      console.error("❌ Помилка збереження платежу:", err);
    }
  };

  // 💰 Підрахунок загальної суми
  const total = useMemo(() => {
    return users.reduce((sum, u) => sum + (Number(u.amount) || 0), 0);
  }, [users]);

  return (
    <section
      className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 ${
        darkMode
          ? "border-fuchsia-900/30 bg-[#1a0a1f]/60 text-fuchsia-100"
          : "border-pink-200 bg-white/70 text-gray-800"
      }`}
    >
      {/* 🏦 Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-pink-500" />
          {i18n.language === "ru" ? "История платежей" : "Історія платежів"}
        </h2>

        <div
          className={`text-lg font-semibold ${
            darkMode ? "text-pink-400" : "text-pink-600"
          }`}
        >
          {i18n.language === "ru" ? "Всего:" : "Разом:"} {total.toFixed(2)} PLN
        </div>
      </div>

      {loading ? (
        <p className="opacity-70">
          {i18n.language === "ru"
            ? "Загрузка данных..."
            : "Завантаження даних..."}
        </p>
      ) : users.length > 0 ? (
        <table
          className={`min-w-[800px] w-full rounded-xl overflow-hidden border ${
            darkMode ? "border-fuchsia-900/30" : "border-pink-200"
          }`}
        >
          <thead className={darkMode ? "bg-fuchsia-950/40" : "bg-pink-100"}>
            <tr>
              <th className="py-2 px-3 text-center">#</th>
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
            {users.map((u, i) => (
              <tr
                key={u.id}
                className={`border-t ${
                  darkMode
                    ? "border-fuchsia-900/30 hover:bg-fuchsia-950/30"
                    : "border-pink-200 hover:bg-pink-50"
                }`}
              >
                {/* № */}
                <td
                  className="py-3 px-3 text-center font-medium"
                  title={`ID: ${u.id}`}
                >
                  {i + 1}
                </td>

                {/* 👤 Користувач */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-pink-500" />
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>

                {/* 📘 Курс */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-fuchsia-400" />
                    <span className="font-medium">{u.course}</span>
                  </div>
                </td>

                {/* 💰 Сума */}
                <td className="py-3 px-3">
                  <input
                    type="number"
                    value={u.amount}
                    onChange={(ev) => handleAmountChange(u.id, ev.target.value)}
                    placeholder="—"
                    style={{ MozAppearance: "textfield" }}
                    className={`px-3 py-2 w-32 rounded-lg text-sm font-semibold border outline-none text-center transition-all 
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none 
                      ${
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

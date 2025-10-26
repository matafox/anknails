import { useEffect, useState } from "react";
import { CreditCard, User, BookOpen, Save } from "lucide-react";

export default function EarningsTab({ i18n, darkMode }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";
  const [users, setUsers] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🧠 Завантаження користувачів
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/users`);
      const data = await res.json();

      // Групуємо користувачів по курсу
      const groupedData = {};
      (data.users || []).forEach((u) => {
        const course = u.course_title || (i18n.language === "ru" ? "Без курса" : "Без курсу");
        if (!groupedData[course]) groupedData[course] = [];
        groupedData[course].push({
          id: u.id,
          name: u.name || u.email || "Без імені",
          course,
          amount: 0,
        });
      });
      setGrouped(groupedData);
    } catch (err) {
      console.error("Помилка завантаження користувачів:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ✏️ Зміна суми для конкретного користувача
  const handleAmountChange = (course, id, value) => {
    setGrouped((prev) => ({
      ...prev,
      [course]: prev[course].map((u) =>
        u.id === id ? { ...u, amount: Number(value) || 0 } : u
      ),
    }));
  };

  // 💾 Збереження всіх оплат
  const handleSave = async () => {
    try {
      setSaving(true);
      const allPayments = Object.values(grouped).flat();
      const res = await fetch(`${BACKEND}/api/payments/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payments: allPayments }),
      });
      const data = await res.json();
      if (data.success) {
        alert(i18n.language === "ru" ? "Сохранено!" : "Збережено!");
      } else {
        alert("Error: " + data.detail);
      }
    } catch (err) {
      console.error("Помилка збереження:", err);
      alert("Помилка збереження даних");
    } finally {
      setSaving(false);
    }
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

      {/* 💾 Кнопка збереження */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow transition-all ${
          darkMode
            ? "bg-fuchsia-700 hover:bg-fuchsia-600 text-white"
            : "bg-pink-500 hover:bg-pink-400 text-white"
        } ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <Save className="w-4 h-4" />
        {saving
          ? i18n.language === "ru"
            ? "Сохранение..."
            : "Збереження..."
          : i18n.language === "ru"
          ? "Сохранить"
          : "Зберегти"}
      </button>

      {loading ? (
        <p className="opacity-70">
          {i18n.language === "ru" ? "Загрузка данных..." : "Завантаження даних..."}
        </p>
      ) : Object.keys(grouped).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(grouped).map(([course, users]) => (
            <div key={course}>
              {/* 🧾 Назва курсу */}
              <h3
                className={`text-lg font-semibold mb-3 flex items-center gap-2 ${
                  darkMode ? "text-fuchsia-300" : "text-pink-600"
                }`}
              >
                <BookOpen className="w-5 h-5" /> {course}
              </h3>

              {/* 🧍 Таблиця студентів курсу */}
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
                  {users.map((u, i) => (
                    <tr
                      key={u.id}
                      className={`border-t ${
                        darkMode
                          ? "border-fuchsia-900/30 hover:bg-fuchsia-950/30"
                          : "border-pink-200 hover:bg-pink-50"
                      }`}
                    >
                      <td className="py-2 px-3">{i + 1}</td>
                      <td className="py-2 px-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-pink-500" />
                        {u.name}
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={u.amount}
                          onChange={(ev) =>
                            handleAmountChange(course, u.id, ev.target.value)
                          }
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
            </div>
          ))}
        </div>
      ) : (
        <p className="opacity-70">
          {i18n.language === "ru"
            ? "Нет пользователей"
            : "Користувачів ще немає"}
        </p>
      )}
    </section>
  );
}

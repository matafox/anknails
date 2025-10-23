import { useEffect, useState } from "react";

export default function SettingsTab({ i18n, darkMode }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/users`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Помилка завантаження користувачів:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const days = parseInt(e.target.days.value);
    const name = e.target.name.value.trim();

    if (!email) return alert("Введіть email");

    try {
      setSaving(true);
      const res = await fetch(`${BACKEND}/api/users/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: "anka12341",
          email,
          name,
          days,
        }),
      });
      const data = await res.json();
      if (data.success) {
        e.target.reset();
        await loadUsers();
        alert("✅ Користувач створений!");
      } else {
        alert("❌ Помилка створення користувача");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Помилка запиту");
    } finally {
      setSaving(false);
    }
  };

  const handleNameChange = async (id, name) => {
    if (!name.trim()) return;
    try {
      await fetch(`${BACKEND}/api/users/update/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "anka12341", name }),
      });
      await loadUsers();
    } catch (err) {
      console.error("Помилка оновлення імені:", err);
    }
  };

  return (
    <section>
      {/* 🧾 Форма створення користувача */}
      <div
        className={`max-w-md space-y-5 p-6 rounded-2xl shadow-lg border ${
          darkMode
            ? "bg-[#1a0a1f]/60 border-fuchsia-900/30"
            : "bg-white/70 border-pink-200"
        }`}
      >
        <h3 className="text-xl font-semibold mb-4">
          {i18n.language === "ru"
            ? "Создать временный аккаунт"
            : "Створити тимчасовий акаунт"}
        </h3>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {i18n.language === "ru" ? "Имя пользователя" : "Ім’я користувача"}
            </label>
            <input
              name="name"
              type="text"
              placeholder="Анна Осипова"
              className="w-full px-4 py-2 rounded-xl border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="user@example.com"
              className="w-full px-4 py-2 rounded-xl border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {i18n.language === "ru"
                ? "Дней доступа"
                : "Кількість днів доступу"}
            </label>
            <input
              name="days"
              type="number"
              defaultValue="7"
              className="w-full px-4 py-2 rounded-xl border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-[1.03] transition-all ${
              saving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {saving
              ? i18n.language === "ru"
                ? "Сохраняем..."
                : "Зберігаємо..."
              : i18n.language === "ru"
              ? "Создать"
              : "Створити"}
          </button>
        </form>
      </div>

      {/* 📋 Таблиця користувачів */}
      <div className="mt-10 overflow-x-auto">
        {loading ? (
          <p className="text-center opacity-70 py-4">
            {i18n.language === "ru" ? "Загрузка..." : "Завантаження..."}
          </p>
        ) : users.length > 0 ? (
          <table
            className={`min-w-[700px] w-full rounded-xl overflow-hidden border ${
              darkMode ? "border-fuchsia-900/30" : "border-pink-200"
            }`}
          >
            <thead className={darkMode ? "bg-fuchsia-950/40" : "bg-pink-100"}>
              <tr>
                <th className="py-2 px-3 text-left">ID</th>
                <th className="py-2 px-3 text-left">
                  {i18n.language === "ru" ? "Имя" : "Ім’я"}
                </th>
                <th className="py-2 px-3 text-left">Email</th>
                <th className="py-2 px-3 text-left">
                  {i18n.language === "ru" ? "Пароль" : "Пароль"}
                </th>
                <th className="py-2 px-3 text-left">
                  {i18n.language === "ru" ? "Доступ до" : "Доступ до"}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className={`border-t ${
                    darkMode
                      ? "border-fuchsia-900/30 hover:bg-fuchsia-950/30"
                      : "border-pink-200 hover:bg-pink-50"
                  }`}
                >
                  <td className="py-2 px-3">{u.id}</td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      defaultValue={u.name || ""}
                      placeholder={i18n.language === "ru" ? "Без имени" : "Без імені"}
                      onBlur={(e) =>
                        handleNameChange(u.id, e.target.value.trim())
                      }
                      className={`px-2 py-1 w-full rounded-md border text-sm outline-none ${
                        darkMode
                          ? "bg-fuchsia-950/40 border-fuchsia-800/40 text-fuchsia-100 focus:border-pink-400"
                          : "bg-white/70 border-pink-200 focus:border-pink-500"
                      }`}
                    />
                  </td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3 font-mono opacity-80">{u.password}</td>
                  <td className="py-2 px-3">
                    {new Date(u.expires_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="opacity-70 mt-4 text-center">
            {i18n.language === "ru"
              ? "Пользователи не найдены"
              : "Користувачів ще немає"}
          </p>
        )}
      </div>
    </section>
  );
}

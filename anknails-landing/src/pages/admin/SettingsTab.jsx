import { useEffect, useState } from "react";

export default function SettingsTab({ i18n, darkMode }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/users`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Помилка завантаження користувачів:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const days = e.target.days.value;
    const name = e.target.name.value || "";

    const res = await fetch(`${BACKEND}/api/users/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "anka12341",
        email,
        name,
        days: parseInt(days),
      }),
    });

    const data = await res.json();
    if (data.success) {
      e.target.reset();
      await loadUsers();
    }
  };

  const handleNameChange = async (id, name) => {
    await fetch(`${BACKEND}/api/users/update/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "anka12341", name }),
    });
    await loadUsers();
  };

  return (
    <section>
      <div className="max-w-md space-y-5">
        <h3 className="text-xl font-semibold mb-4">
          {i18n.language === "ru"
            ? "Создать временный аккаунт"
            : "Створити тимчасовий акаунт"}
        </h3>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Ім’я користувача
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
              Email користувача
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
              Днів доступу
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
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(255,0,128,0.3)]"
          >
            {i18n.language === "ru" ? "Создать" : "Створити"}
          </button>
        </form>
      </div>

      {/* 📋 Таблиця користувачів */}
      <div className="mt-8 overflow-x-auto">
        {users.length > 0 ? (
          <table className="min-w-[700px] w-full border border-pink-200 rounded-xl overflow-hidden">
            <thead className="bg-pink-100">
              <tr>
                <th className="py-2 px-3 text-left">ID</th>
                <th className="py-2 px-3 text-left">Ім’я</th>
                <th className="py-2 px-3 text-left">Email</th>
                <th className="py-2 px-3 text-left">Пароль</th>
                <th className="py-2 px-3 text-left">Доступ до</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-pink-50">
                  <td className="py-2 px-3">{u.id}</td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      defaultValue={u.name || ""}
                      placeholder="Без імені"
                      onBlur={(e) =>
                        handleNameChange(u.id, e.target.value.trim())
                      }
                      className="px-2 py-1 w-full rounded-md border border-pink-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-sm bg-white/70"
                    />
                  </td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3 font-mono">{u.password}</td>
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

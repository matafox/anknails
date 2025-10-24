import { useEffect, useState } from "react";

export default function SettingsTab({ i18n, darkMode }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // 🧠 Завантаження користувачів
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

  // 🎓 Завантаження курсів
  const loadCourses = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/courses`);
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Помилка завантаження курсів:", err);
    }
  };

  useEffect(() => {
    loadUsers();
    loadCourses();
  }, []);

  // 🧾 Створення користувача
  const handleCreate = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const name = e.target.name.value.trim();
    const days = parseInt(e.target.days.value);
    const course_id = parseInt(e.target.course.value) || null;
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
          course_id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        e.target.reset();
        await loadUsers();
        alert("✅ Користувач створений!");
      } else alert("❌ Помилка створення користувача");
    } catch (err) {
      console.error(err);
      alert("❌ Помилка запиту");
    } finally {
      setSaving(false);
    }
  };

  // ✏️ Оновлення імені
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

  // 🎓 Оновлення курсу користувача
  const handleCourseChange = async (id, course_id) => {
    try {
      await fetch(`${BACKEND}/api/users/update/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "anka12341", course_id }),
      });
      await loadUsers();
    } catch (err) {
      console.error("Помилка оновлення курсу:", err);
    }
  };

  // 📊 Завантаження прогресу користувача
  const loadProgress = async (userId) => {
    try {
      setLoadingProgress(true);
      const res = await fetch(`${BACKEND}/api/progress/user/${userId}`);
      const data = await res.json();
      setProgress(data.progress || []);
      setSelectedUser(userId);
    } catch (err) {
      console.error("Помилка завантаження прогресу:", err);
    } finally {
      setLoadingProgress(false);
    }
  };

  // ✅ Позначити домашку виконаною
  const markHomeworkDone = async (lesson_id) => {
    try {
      const res = await fetch(`${BACKEND}/api/progress/homework`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedUser,
          lesson_id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await loadProgress(selectedUser);
      } else {
        alert("❌ Помилка оновлення домашки");
      }
    } catch (err) {
      console.error("Помилка:", err);
    }
  };

  return (
    <section>
      {/* 🧾 Створення користувача */}
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
            <label className="block text-sm font-medium mb-1">Email</label>
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

          {/* 🎓 Курс */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {i18n.language === "ru" ? "Курс" : "Курс"}
            </label>
            <select
              name="course"
              className="w-full px-4 py-2 rounded-xl border border-pink-300 focus:border-pink-500 outline-none"
            >
              <option value="">
                {i18n.language === "ru" ? "Без курса" : "Без курсу"}
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
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
            className={`min-w-[800px] w-full rounded-xl overflow-hidden border ${
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
                <th className="py-2 px-3 text-left">Пароль</th>
                <th className="py-2 px-3 text-left">
                  {i18n.language === "ru" ? "Курс" : "Курс"}
                </th>
                <th className="py-2 px-3 text-left">
                  {i18n.language === "ru" ? "Доступ до" : "Доступ до"}
                </th>
                <th></th>
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
                      onBlur={(e) => handleNameChange(u.id, e.target.value.trim())}
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
                    <select
                      defaultValue={u.course_id || ""}
                      onChange={(e) => handleCourseChange(u.id, e.target.value)}
                      className="px-2 py-1 rounded-md border border-pink-300 text-sm outline-none bg-white/70"
                    >
                      <option value="">
                        {i18n.language === "ru" ? "Без курса" : "Без курсу"}
                      </option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3">
                    {new Date(u.expires_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => loadProgress(u.id)}
                      className="text-sm text-pink-600 hover:underline"
                    >
                      {i18n.language === "ru"
                        ? "Прогресс"
                        : "Переглянути прогрес"}
                    </button>
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

      {/* 📊 Прогрес користувача */}
      {selectedUser && (
        <div className="mt-10">
          <h4 className="text-lg font-semibold mb-4">
            {i18n.language === "ru" ? "Прогресс пользователя" : "Прогрес користувача"} #{selectedUser}
          </h4>

          {loadingProgress ? (
            <p className="opacity-70">Завантаження...</p>
          ) : progress.length > 0 ? (
            <table
              className={`min-w-[600px] w-full rounded-xl overflow-hidden border ${
                darkMode ? "border-fuchsia-900/30" : "border-pink-200"
              }`}
            >
              <thead className={darkMode ? "bg-fuchsia-950/40" : "bg-pink-100"}>
                <tr>
                  <th className="py-2 px-3 text-left">Lesson ID</th>
                  <th className="py-2 px-3 text-left">Прогрес</th>
                  <th className="py-2 px-3 text-left">Домашка</th>
                </tr>
              </thead>
              <tbody>
                {progress.map((p) => {
                  const percent =
                    p.total_seconds > 0
                      ? Math.round((p.watched_seconds / p.total_seconds) * 100)
                      : 0;
                  return (
                    <tr
                      key={p.lesson_id}
                      className={`border-t ${
                        darkMode
                          ? "border-fuchsia-900/30 hover:bg-fuchsia-950/30"
                          : "border-pink-200 hover:bg-pink-50"
                      }`}
                    >
                      <td className="py-2 px-3">{p.lesson_id}</td>
                      <td className="py-2 px-3">{percent}%</td>
                      <td className="py-2 px-3">
                        {p.homework_done ? (
                          <span className="text-green-500">✅</span>
                        ) : (
                          <button
                            onClick={() => markHomeworkDone(p.lesson_id)}
                            className="text-xs px-3 py-1 rounded-md bg-pink-100 text-pink-700 hover:bg-pink-200"
                          >
                            Позначити
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="opacity-70">Немає даних про прогрес.</p>
          )}
        </div>
      )}
    </section>
  );
}

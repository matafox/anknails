import { useEffect, useState } from "react";

export default function SettingsTab({ i18n, darkMode }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [progress, setProgress] = useState([]);
  const [courseProgress, setCourseProgress] = useState({ total: 0, completed: 0, percent: 0 });

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
    const rawDays = e.target.days.value;
    const days = Number.isFinite(parseInt(rawDays, 10)) ? parseInt(rawDays, 10) : 7;

    const rawCourse = e.target.course.value;
    const course_id = rawCourse === "" ? null : Number(rawCourse);

    const packageValue = e.target.package.value; // solo | pro
    if (!email) return alert(i18n.language === "ru" ? "Введите email" : "Введіть email");

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
          package: packageValue,
        }),
      });
      const data = await res.json();
      if (data.success) {
        e.target.reset();
        await loadUsers();
        alert(i18n.language === "ru" ? "✅ Пользователь создан!" : "✅ Користувач створений!");
      } else {
        alert(i18n.language === "ru" ? "❌ Ошибка создания пользователя" : "❌ Помилка створення користувача");
      }
    } catch (err) {
      console.error(err);
      alert(i18n.language === "ru" ? "❌ Ошибка запроса" : "❌ Помилка запиту");
    } finally {
      setSaving(false);
    }
  };

  // ✏️ Оновлення імені
  const handleNameChange = async (id, name) => {
    const v = name.trim();
    if (!v) return;
    try {
      await fetch(`${BACKEND}/api/users/update/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "anka12341", name: v }),
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

  // 📦 Оновлення пакета користувача
  const handlePackageChange = async (id, pkg) => {
    try {
      await fetch(`${BACKEND}/api/users/update/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "anka12341", package: pkg }), // solo | pro
      });
      await loadUsers();
    } catch (err) {
      console.error("Помилка оновлення пакета:", err);
    }
  };

  // 📊 Завантаження прогресу користувача + прогресу курсу
  const loadProgress = async (userId) => {
    try {
      setLoadingProgress(true);

      const [resUser, resCourse] = await Promise.all([
        fetch(`${BACKEND}/api/progress/user/${userId}`),
        fetch(`${BACKEND}/api/progress/course/${userId}`),
      ]);

      const dataUser = await resUser.json();
      const dataCourse = await resCourse.json();

      setProgress(dataUser.progress || []);
      setCourseProgress({
        total: dataCourse.total ?? 0,
        completed: dataCourse.completed ?? 0,
        percent: dataCourse.percent ?? 0,
      });
      setSelectedUser(userId);
    } catch (err) {
      console.error("Помилка завантаження прогресу:", err);
      setProgress([]);
      setCourseProgress({ total: 0, completed: 0, percent: 0 });
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
        alert(i18n.language === "ru" ? "❌ Ошибка обновления домашки" : "❌ Помилка оновлення домашки");
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

          {/* 🧩 Пакет */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {i18n.language === "ru" ? "Пакет" : "Пакет"}
            </label>
            <select
              name="package"
              className="w-full px-4 py-2 rounded-xl border border-pink-300 focus:border-pink-500 outline-none"
              defaultValue="solo"
            >
              <option value="solo">
                {i18n.language === "ru" ? "Самостоятельный" : "Самостійний"}
              </option>
              <option value="pro">Pro</option>
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
                  {i18n.language === "ru" ? "Пакет" : "Пакет"}
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
                      value={u.course_id ?? ""}
                      onChange={(e) =>
                        handleCourseChange(
                          u.id,
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className={`px-2 py-1 rounded-md border text-sm outline-none ${
                        darkMode
                          ? "bg-fuchsia-950/40 border-fuchsia-800/40 text-fuchsia-100 focus:border-pink-400"
                          : "bg-white/70 border-pink-200 focus:border-pink-500"
                      }`}
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
                    <select
                      value={u.package || "solo"}
                      onChange={(e) => handlePackageChange(u.id, e.target.value)}
                      className={`px-2 py-1 rounded-md border text-sm outline-none ${
                        darkMode
                          ? "bg-fuchsia-950/40 border-fuchsia-800/40 text-fuchsia-100 focus:border-pink-400"
                          : "bg-white/70 border-pink-200 focus:border-pink-500"
                      }`}
                    >
                      <option value="solo">
                        {i18n.language === "ru"
                          ? "Самостоятельный"
                          : "Самостійний"}
                      </option>
                      <option value="pro">Pro</option>
                    </select>
                  </td>

                  <td className="py-2 px-3">
                    {new Date(u.expires_at) < new Date() ? (
                      <span className="text-red-500 font-medium">
                        {i18n.language === "ru" ? "Истёк" : "Вигасло"}
                      </span>
                    ) : (
                      <span>{new Date(u.expires_at).toLocaleDateString()}</span>
                    )}
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
            {i18n.language === "ru"
              ? "Прогресс пользователя"
              : "Прогрес користувача"}{" "}
            #{selectedUser}
          </h4>

          {/* Курсовий прогрес */}
          <div
            className={`mb-6 p-4 rounded-xl border ${
              darkMode ? "bg-fuchsia-950/40 border-fuchsia-900/30" : "bg-pink-50 border-pink-200"
            }`}
          >
            <p className="text-sm">
              {i18n.language === "ru" ? "Прогресс курса:" : "Прогрес курсу:"}{" "}
              <b>{courseProgress.percent}%</b> • {courseProgress.completed}/
              {courseProgress.total}
            </p>
            <div className="h-2 mt-2 bg-pink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-700"
                style={{ width: `${courseProgress.percent}%` }}
              />
            </div>
          </div>

          {loadingProgress ? (
            <p className="opacity-70">Завантаження...</p>
          ) : progress.length > 0 ? (
            <table
              className={`min-w-[700px] w-full rounded-xl overflow-hidden border ${
                darkMode ? "border-fuchsia-900/30" : "border-pink-200"
              }`}
            >
              <thead className={darkMode ? "bg-fuchsia-950/40" : "bg-pink-100"}>
                <tr>
                  <th className="py-2 px-3 text-left">
                    {i18n.language === "ru" ? "Урок ID" : "Lesson ID"}
                  </th>
                  <th className="py-2 px-3 text-left">
                    {i18n.language === "ru" ? "Название урока" : "Назва уроку"}
                  </th>
                  <th className="py-2 px-3 text-left">
                    {i18n.language === "ru" ? "Прогресс" : "Прогрес"}
                  </th>
                  <th className="py-2 px-3 text-left">
                    {i18n.language === "ru" ? "Домашка" : "Домашка"}
                  </th>
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
                      <td className="py-2 px-3 font-mono opacity-80">
                        {p.lesson_id}
                      </td>
                      <td className="py-2 px-3">{p.lesson_title}</td>
                      <td className="py-2 px-3">{percent}%</td>
                      <td className="py-2 px-3">
                        {p.homework_done ? (
                          <span className="text-green-500">✅</span>
                        ) : (
                          <button
                            onClick={() => markHomeworkDone(p.lesson_id)}
                            className="text-xs px-3 py-1 rounded-md bg-pink-100 text-pink-700 hover:bg-pink-200"
                          >
                            {i18n.language === "ru" ? "Отметить" : "Позначити"}
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

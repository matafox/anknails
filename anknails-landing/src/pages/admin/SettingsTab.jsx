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

  // 🆕 статуси сертифікатів
  const [certStatuses, setCertStatuses] = useState({}); // { [userId]: { unlocked, unlock_at, requested, approved, file_url? } }

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/users`);
      const data = await res.json();
      const list = data.users || [];
      setUsers(list);

      const pairs = await Promise.all(
        list.map(async (u) => {
          try {
            const r = await fetch(`${BACKEND}/api/cert/status?user_id=${u.id}`);
            const j = await r.json();
            return [
              u.id,
              {
                unlocked: !!j.unlocked,
                unlock_at: j.unlock_at ?? null,
                requested: !!j.requested,
                approved: !!j.approved,
                file_url: j.file_url ?? null, // ← бек віддає, див. app.py нижче
              },
            ];
          } catch {
            return [u.id, { unlocked: false, unlock_at: null, requested: false, approved: false, file_url: null }];
          }
        })
      );
      setCertStatuses(Object.fromEntries(pairs));
    } catch (err) {
      console.error("Помилка завантаження користувачів:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreate = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const name = e.target.name.value.trim();
    const rawDays = e.target.days.value;
    const days = Number.isFinite(parseInt(rawDays, 10)) ? parseInt(rawDays, 10) : 7;
    const rawCourse = e.target.course.value;
    const course_id = rawCourse === "" ? null : Number(rawCourse);
    const packageValue = e.target.package.value;

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

  const handlePackageChange = async (id, pkg) => {
    try {
      await fetch(`${BACKEND}/api/users/update/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "anka12341", package: pkg }),
      });
      await loadUsers();
    } catch (err) {
      console.error("Помилка оновлення пакета:", err);
    }
  };

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

  // 🆕 Встановити URL PDF сертифіката
  const setCertUrl = async (userId, url) => {
    const v = (url || "").trim();
    if (!v) return;
    try {
      const r = await fetch(`${BACKEND}/api/cert/admin/set-file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "anka12341", user_id: userId, file_url: v }),
      });
      const j = await r.json();
      if (!j.success) throw new Error("save failed");
      await loadUsers();
      alert(i18n.language === "ru" ? "Ссылка сохранена" : "Посилання збережено");
    } catch (e) {
      alert(i18n.language === "ru" ? "Не удалось сохранить ссылку" : "Не вдалося зберегти посилання");
    }
  };

  // 🆕 Швидке схвалення + відкриття (генератор або власний файл)
  const adminDownloadAndApprove = async (userId) => {
    try {
      await fetch(`${BACKEND}/api/cert/admin/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "anka12341", user_id: userId, approved: true }),
      });
      window.open(`${BACKEND}/api/cert/generate?user_id=${userId}`, "_blank", "noopener,noreferrer");
      await loadUsers();
    } catch (e) {
      alert(i18n.language === "ru" ? "Не удалось открыть сертификат" : "Не вдалося відкрити сертифікат");
    }
  };

  return (
    <section>
      {/* Створення користувача (без змін)... */}
      {/* ...код форми створення як у тебе вище... */}

      {/* 📋 Таблиця користувачів */}
      <div className="mt-10 overflow-x-auto">
        {loading ? (
          <p className="text-center opacity-70 py-4">
            {i18n.language === "ru" ? "Загрузка..." : "Завантаження..."}
          </p>
        ) : users.length > 0 ? (
          <table
            className={`min-w-[1080px] w-full rounded-xl overflow-hidden border ${
              darkMode ? "border-fuchsia-900/30" : "border-pink-200"
            }`}
          >
            <thead className={darkMode ? "bg-fuchsia-950/40" : "bg-pink-100"}>
              <tr>
                <th className="py-2 px-3 text-left">ID</th>
                <th className="py-2 px-3 text-left">{i18n.language === "ru" ? "Имя" : "Ім’я"}</th>
                <th className="py-2 px-3 text-left">Email</th>
                <th className="py-2 px-3 text-left">Пароль</th>
                <th className="py-2 px-3 text-left">{i18n.language === "ru" ? "Курс" : "Курс"}</th>
                <th className="py-2 px-3 text-left">{i18n.language === "ru" ? "Пакет" : "Пакет"}</th>
                <th className="py-2 px-3 text-left">{i18n.language === "ru" ? "Доступ до" : "Доступ до"}</th>
                <th className="py-2 px-3 text-left">{i18n.language === "ru" ? "Сертификат" : "Сертифікат"}</th>
                <th className="py-2 px-3 text-left">{i18n.language === "ru" ? "Файл/URL" : "Файл/URL"}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const cs = certStatuses[u.id] || {};
                const unlocked = !!cs.unlocked;
                const unlockDate = cs.unlock_at ? new Date(cs.unlock_at).toLocaleDateString() : null;
                return (
                  <tr
                    key={u.id}
                    className={`border-top ${
                      darkMode ? "border-fuchsia-900/30 hover:bg-fuchsia-950/30" : "border-pink-200 hover:bg-pink-50"
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
                        onChange={(e) => handleCourseChange(u.id, e.target.value ? Number(e.target.value) : null)}
                        className={`px-2 py-1 rounded-md border text-sm outline-none ${
                          darkMode
                            ? "bg-fuchsia-950/40 border-fuchsia-800/40 text-fuchsia-100 focus:border-pink-400"
                            : "bg-white/70 border-pink-200 focus:border-pink-500"
                        }`}
                      >
                        <option value="">{i18n.language === "ru" ? "Без курса" : "Без курсу"}</option>
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
                        <option value="solo">{i18n.language === "ru" ? "Самостоятельный" : "Самостійний"}</option>
                        <option value="pro">Pro</option>
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      {new Date(u.expires_at) < new Date() ? (
                        <span className="text-red-500 font-medium">{i18n.language === "ru" ? "Истёк" : "Вигасло"}</span>
                      ) : (
                        <span>{new Date(u.expires_at).toLocaleDateString()}</span>
                      )}
                    </td>

                    {/* Статус сертифіката */}
                    <td className="py-2 px-3">
                      {!unlocked && unlockDate && (
                        <span className="text-xs">
                          {i18n.language === "ru" ? "Откроется:" : "Відкриється:"} {unlockDate}
                        </span>
                      )}
                      {unlocked && !cs.requested && (
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          {i18n.language === "ru" ? "Нет запроса" : "Немає запиту"}
                        </span>
                      )}
                      {unlocked && cs.requested && !cs.approved && (
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          {i18n.language === "ru" ? "Запрошен" : "Запит отримано"}
                        </span>
                      )}
                      {unlocked && cs.approved && (
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {i18n.language === "ru" ? "Одобрен" : "Схвалено"}
                        </span>
                      )}
                    </td>

                    {/* URL PDF */}
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2 min-w-[280px]">
                        <input
                          type="url"
                          defaultValue={cs.file_url || ""}
                          placeholder="https://.../certificate.pdf"
                          onBlur={(e) => {
                            const val = e.target.value.trim();
                            if (val) setCertUrl(u.id, val);
                          }}
                          className={`px-2 py-1 w-full rounded-md border text-sm outline-none ${
                            darkMode
                              ? "bg-fuchsia-950/40 border-fuchsia-800/40 text-fuchsia-100 focus:border-pink-400"
                              : "bg-white/70 border-pink-200 focus:border-pink-500"
                          }`}
                        />
                        {cs.file_url ? (
                          <a
                            href={cs.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-pink-600 text-sm underline"
                          >
                            {i18n.language === "ru" ? "Открыть" : "Відкрити"}
                          </a>
                        ) : null}
                      </div>
                    </td>

                    <td className="py-2 px-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => loadProgress(u.id)} className="text-sm text-pink-600 hover:underline">
                          {i18n.language === "ru" ? "Прогресс" : "Переглянути прогрес"}
                        </button>

                        {unlocked && cs.requested && !cs.approved && (
                          <button
                            onClick={() => adminDownloadAndApprove(u.id)}
                            className="text-sm text-rose-600 hover:underline"
                          >
                            {i18n.language === "ru" ? "Скачать сертификат" : "Завантажити сертифікат"}
                          </button>
                        )}

                        {unlocked && cs.approved && (
                          <button
                            onClick={() =>
                              window.open(`${BACKEND}/api/cert/generate?user_id=${u.id}`, "_blank", "noopener,noreferrer")
                            }
                            className="text-sm text-rose-600 hover:underline"
                          >
                            {i18n.language === "ru" ? "Открыть" : "Відкрити"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="opacity-70 mt-4 text-center">
            {i18n.language === "ru" ? "Пользователи не найдены" : "Користувачів ще немає"}
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
                          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✅ {i18n.language === "ru" ? "Выполнено" : "Виконано"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            — {i18n.language === "ru" ? "Нет отметки" : "Немає позначки"}
                          </span>
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

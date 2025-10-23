import { useEffect, useState } from "react";

export default function SettingsTab({ i18n }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const loadUsers = async () => {
    const res = await fetch(`${BACKEND}/api/users`);
    const data = await res.json();
    setUsers(data.users || []);
  };

  const loadCourses = async () => {
    const res = await fetch(`${BACKEND}/api/courses`);
    const data = await res.json();
    setCourses(data.courses || []);
  };

  useEffect(() => {
    loadUsers();
    loadCourses();
  }, []);

  const handleCourseChange = async (id, course_id) => {
    await fetch(`${BACKEND}/api/users/update/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "anka12341", course_id }),
    });
    loadUsers();
  };

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Користувачі</h3>
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full border border-pink-200 rounded-xl overflow-hidden">
          <thead className="bg-pink-100">
            <tr>
              <th className="py-2 px-3 text-left">ID</th>
              <th className="py-2 px-3 text-left">Ім’я</th>
              <th className="py-2 px-3 text-left">Email</th>
              <th className="py-2 px-3 text-left">Курс</th>
              <th className="py-2 px-3 text-left">Доступ до</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-pink-50">
                <td className="py-2 px-3">{u.id}</td>
                <td className="py-2 px-3">{u.name || "—"}</td>
                <td className="py-2 px-3">{u.email}</td>
                <td className="py-2 px-3">
                  <select
                    value={u.course_id || ""}
                    onChange={(e) =>
                      handleCourseChange(u.id, e.target.value || null)
                    }
                    className="px-2 py-1 rounded-md border border-pink-200 text-sm bg-white/70"
                  >
                    <option value="">—</option>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

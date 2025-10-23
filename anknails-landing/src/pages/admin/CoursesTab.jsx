import { useEffect, useState } from "react";
import { Edit3, PlusCircle, Trash2, Save } from "lucide-react";

export default function CoursesTab({ darkMode, i18n }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editId, setEditId] = useState(null);

  const fetchCourses = async () => {
    const res = await fetch(`${BACKEND}/api/courses`);
    const data = await res.json();
    setCourses(data.courses || []);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId
      ? `${BACKEND}/api/courses/update/${editId}`
      : `${BACKEND}/api/courses/create`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "anka12341", ...form }),
    });
    setForm({ title: "", description: "" });
    setEditId(null);
    fetchCourses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Видалити курс?")) return;
    await fetch(`${BACKEND}/api/courses/delete/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "anka12341" }),
    });
    fetchCourses();
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder={i18n.language === "ru" ? "Название курса" : "Назва курсу"}
          className="w-full px-4 py-2 rounded-xl border border-pink-300 focus:ring-1 focus:ring-pink-500 outline-none"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder={i18n.language === "ru" ? "Описание" : "Опис"}
          className="w-full px-4 py-2 rounded-xl border border-pink-300 focus:ring-1 focus:ring-pink-500 outline-none"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-[1.03] transition-all"
        >
          {editId
            ? i18n.language === "ru"
              ? "Сохранить изменения"
              : "Зберегти зміни"
            : i18n.language === "ru"
            ? "Создать курс"
            : "Створити курс"}
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((c) => (
          <div
            key={c.id}
            className={`p-5 rounded-2xl border transition-all hover:shadow-lg ${
              darkMode
                ? "border-fuchsia-900/30 bg-[#1a0a1f]/70"
                : "border-pink-200 bg-white/80"
            }`}
          >
            <h4 className="font-semibold text-lg mb-1">{c.title}</h4>
            <p className="text-sm opacity-70 mb-3">{c.description}</p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  setEditId(c.id);
                  setForm(c);
                }}
                className="text-blue-500 flex items-center gap-1"
              >
                <Edit3 className="w-4 h-4" />{" "}
                {i18n.language === "ru" ? "Ред." : "Редагувати"}
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-red-500 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />{" "}
                {i18n.language === "ru" ? "Удалить" : "Видалити"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

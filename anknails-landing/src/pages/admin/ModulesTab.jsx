import { useState, useEffect } from "react";
import { Edit3, PlusCircle, Trash2, Save, FolderMinus } from "lucide-react";

export default function ModulesTab({ darkMode, i18n }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [lessons, setLessons] = useState({});
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    youtube: "",
    homework: "",
    materials: "",
  });
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const fetchCourses = async () => {
    const res = await fetch(`${BACKEND}/api/courses`);
    const data = await res.json();
    setCourses(data.courses || []);
    if (!selectedCourse && data.courses.length > 0) {
      setSelectedCourse(data.courses[0].id);
    }
  };

  const fetchModules = async (courseId) => {
    const res = await fetch(`${BACKEND}/api/modules/${courseId}`);
    const data = await res.json();
    setModules(data.modules || []);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) fetchModules(selectedCourse);
  }, [selectedCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId
      ? `${BACKEND}/api/modules/update/${editId}`
      : `${BACKEND}/api/modules/create`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "anka12341",
        course_id: selectedCourse,
        ...form,
      }),
    });

    setForm({ title: "", description: "" });
    setEditId(null);
    fetchModules(selectedCourse);
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm("Видалити модуль?")) return;
    await fetch(`${BACKEND}/api/modules/delete/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "anka12341" }),
    });
    fetchModules(selectedCourse);
  };

  const fetchLessons = async (moduleId) => {
    const res = await fetch(`${BACKEND}/api/lessons/${moduleId}`);
    const data = await res.json();
    setLessons((prev) => ({ ...prev, [moduleId]: data.lessons || [] }));
  };

  const handleLessonSubmit = async (e, moduleId) => {
    e.preventDefault();
    const url = editingLessonId
      ? `${BACKEND}/api/lessons/update/${editingLessonId}`
      : `${BACKEND}/api/lessons/create`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "anka12341", module_id: moduleId, ...lessonForm }),
    });

    setLessonForm({
      title: "",
      description: "",
      youtube: "",
      homework: "",
      materials: "",
    });
    setEditingLessonId(null);
    fetchLessons(moduleId);
  };

  return (
    <div className="space-y-10">
      {/* 🏫 Вибір курсу */}
      <div className="max-w-lg">
        <label className="block font-medium mb-1">Курс:</label>
        <select
          value={selectedCourse || ""}
          onChange={(e) => setSelectedCourse(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-xl border border-pink-300"
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* 🧩 Створення / редагування модуля */}
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Назва модуля"
          className="w-full px-4 py-2 rounded-xl border border-pink-300"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Опис"
          className="w-full px-4 py-2 rounded-xl border border-pink-300"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold"
        >
          {editId ? "Зберегти зміни" : "Створити модуль"}
        </button>
      </form>

      {/* 🔹 Список модулів */}
      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className={`p-5 rounded-2xl border ${
              darkMode
                ? "border-fuchsia-900/30 bg-[#1a0a1f]/70"
                : "border-pink-200 bg-white/80"
            }`}
          >
            <h4 className="font-semibold text-lg">{mod.title}</h4>
            <p className="text-sm opacity-70 mb-2">{mod.description}</p>
            <p className="text-xs opacity-60 mb-4">Уроків: {mod.lessons}</p>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setEditId(mod.id);
                  setForm({ title: mod.title, description: mod.description });
                }}
                className="text-blue-500 flex items-center gap-1"
              >
                <Edit3 className="w-4 h-4" /> Редагувати
              </button>
              <button
                onClick={() => handleDeleteModule(mod.id)}
                className="text-red-500 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Видалити
              </button>
            </div>

            {/* 📚 Уроки */}
            <button
              onClick={() => {
                setExpanded(expanded === mod.id ? null : mod.id);
                fetchLessons(mod.id);
              }}
              className="mt-3 text-pink-500 underline text-sm"
            >
              {expanded === mod.id ? "Сховати уроки" : "Показати уроки"}
            </button>

            {expanded === mod.id && (
              <div className="mt-3 space-y-3 border-t border-pink-200 pt-3">
                {(lessons[mod.id] || []).map((l) => (
                  <div key={l.id} className="p-2 rounded-lg bg-pink-50 text-sm">
                    <b>{l.title}</b>
                    <p>{l.description}</p>
                  </div>
                ))}

                <form onSubmit={(e) => handleLessonSubmit(e, mod.id)} className="space-y-2">
                  <input
                    placeholder="Назва уроку"
                    value={lessonForm.title}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-pink-300 rounded-lg"
                    required
                  />
                  <input
                    placeholder="YouTube URL"
                    value={lessonForm.youtube}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, youtube: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-pink-300 rounded-lg"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg"
                  >
                    <PlusCircle className="w-4 h-4" /> Додати урок
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

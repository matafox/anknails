import { useState, useEffect } from "react";
import { Edit3, PlusCircle, Trash2 } from "lucide-react";

export default function ModulesTab({ darkMode, i18n }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", lessons: 0 });
  const [editId, setEditId] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    youtube: "",
    homework: "",
    materials: "",
  });
  const [lessons, setLessons] = useState({});

  // 🧠 Завантаження модулів
  const fetchModules = async () => {
    const res = await fetch(`${BACKEND}/api/modules`);
    const data = await res.json();
    setModules(data.modules || []);
  };

  // 🧠 Завантаження уроків
  const fetchLessons = async (moduleId) => {
    const res = await fetch(`${BACKEND}/api/lessons/${moduleId}`);
    const data = await res.json();
    setLessons((prev) => ({ ...prev, [moduleId]: data.lessons || [] }));
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // 🧩 Створення / редагування модуля
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId
      ? `${BACKEND}/api/modules/update/${editId}`
      : `${BACKEND}/api/modules/create`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "anka12341", ...form }),
    });

    setForm({ title: "", description: "", lessons: 0 });
    setEditId(null);
    fetchModules();
  };

  const handleEdit = (mod) => {
    setForm({
      title: mod.title,
      description: mod.description,
      lessons: mod.lessons,
    });
    setEditId(mod.id);
  };

  const toggleActive = async (id, current) => {
    await fetch(`${BACKEND}/api/modules/update/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !current }),
    });
    fetchModules();
  };

  // 🎥 Створення уроку
  const handleLessonSubmit = async (e, moduleId) => {
    e.preventDefault();

    await fetch(`${BACKEND}/api/lessons/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        module_id: moduleId,
        token: "anka12341",
        ...lessonForm,
      }),
    });

    setLessonForm({
      title: "",
      description: "",
      youtube: "",
      homework: "",
      materials: "",
    });

    fetchLessons(moduleId);
  };

  // 🗑️ Видалення уроку
  const handleDeleteLesson = async (lessonId, moduleId) => {
    if (!window.confirm("Видалити цей урок?")) return;
    await fetch(`${BACKEND}/api/lessons/delete/${lessonId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "anka12341" }),
    });
    fetchLessons(moduleId);
  };

  // 🎞️ Безпечний iframe-компонент
  const SafeYoutube = ({ embedUrl }) =>
    embedUrl ? (
      <iframe
        src={`${embedUrl}?modestbranding=1&rel=0&showinfo=0`}
        className="w-full aspect-video rounded-xl border border-pink-300"
        allowFullScreen
      />
    ) : null;

  return (
    <div className="space-y-10">
      {/* 🧩 Форма модуля */}
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder={i18n.language === "ru" ? "Название модуля" : "Назва модуля"}
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
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(255,0,128,0.3)]"
        >
          {editId
            ? i18n.language === "ru"
              ? "Сохранить изменения"
              : "Зберегти зміни"
            : i18n.language === "ru"
            ? "Создать модуль"
            : "Створити модуль"}
        </button>
      </form>

      {/* 🔹 Список модулів */}
      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className={`p-5 rounded-2xl border transition-all hover:shadow-lg ${
              darkMode
                ? "border-fuchsia-900/30 bg-[#1a0a1f]/70"
                : "border-pink-200 bg-white/80"
            }`}
          >
            <div
              className="cursor-pointer"
              onClick={() => {
                setExpanded(expanded === mod.id ? null : mod.id);
                fetchLessons(mod.id);
              }}
            >
              <h4 className="font-semibold text-lg">{mod.title}</h4>
              <p className="text-sm opacity-70 mb-2">{mod.description}</p>
              <p className="text-xs opacity-60 mb-4">
                {i18n.language === "ru" ? "Уроков" : "Уроків"}: {mod.lessons}
              </p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => handleEdit(mod)}
                className="flex items-center gap-2 text-sm text-pink-500 hover:scale-105 transition"
              >
                <Edit3 className="w-4 h-4" />
                {i18n.language === "ru" ? "Редактировать" : "Редагувати"}
              </button>
              <button
                onClick={() => toggleActive(mod.id, mod.active)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  mod.active
                    ? "bg-green-500/80 text-white"
                    : "bg-gray-400/40 text-gray-800"
                }`}
              >
                {mod.active
                  ? i18n.language === "ru"
                    ? "Активен"
                    : "Активний"
                  : i18n.language === "ru"
                  ? "Выключен"
                  : "Вимкнено"}
              </button>
            </div>

            {/* 📘 Уроки */}
            {expanded === mod.id && (
              <div className="mt-4 border-t border-pink-200/30 pt-4">
                <h5 className="font-semibold mb-3 text-pink-500">
                  {i18n.language === "ru" ? "Уроки модуля" : "Уроки модуля"}
                </h5>

                {/* 🧾 Список уроків */}
                <div className="space-y-3 mb-4">
                  {lessons[mod.id]?.map((l) => (
                    <div
                      key={l.id}
                      className="p-3 rounded-lg border border-pink-200/50 text-sm bg-white/40"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-pink-600">{l.title}</p>
                        <button
                          onClick={() => handleDeleteLesson(l.id, mod.id)}
                          className="text-red-500 hover:scale-110 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 🎞️ Відео */}
                      {l.embed_url && (
                        <div className="mt-2">
                          <SafeYoutube embedUrl={l.embed_url} />
                        </div>
                      )}

                      {l.homework && (
                        <p className="text-xs opacity-70 mt-1">📝 {l.homework}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* ➕ Форма додавання уроку */}
                <form
                  onSubmit={(e) => handleLessonSubmit(e, mod.id)}
                  className="space-y-2"
                >
                  <input
                    placeholder={i18n.language === "ru" ? "Название урока" : "Назва уроку"}
                    value={lessonForm.title}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-pink-300"
                    required
                  />
                  <input
                    placeholder="YouTube URL"
                    value={lessonForm.youtube}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, youtube: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-pink-300"
                  />
                  <textarea
                    placeholder={i18n.language === "ru" ? "Описание урока" : "Опис уроку"}
                    value={lessonForm.description}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-pink-300"
                  />
                  <textarea
                    placeholder={
                      i18n.language === "ru" ? "Домашнее задание" : "Домашнє завдання"
                    }
                    value={lessonForm.homework}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, homework: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-pink-300"
                  />
                  <textarea
                    placeholder={
                      i18n.language === "ru"
                        ? "Материалы (ссылки, текст)"
                        : "Матеріали (посилання, текст)"
                    }
                    value={lessonForm.materials}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, materials: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-pink-300"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500 text-white font-medium hover:scale-105 transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {i18n.language === "ru" ? "Добавить урок" : "Додати урок"}
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

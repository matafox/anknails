import { useState, useEffect } from "react";
import { Edit3 } from "lucide-react";

export default function ModulesTab({ darkMode, i18n }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", lessons: 0 });
  const [editId, setEditId] = useState(null);

  const fetchModules = async () => {
    const res = await fetch(`${BACKEND}/api/modules`);
    const data = await res.json();
    setModules(data.modules || []);
  };

  useEffect(() => {
    fetchModules();
  }, []);

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

  return (
    <div className="space-y-10">
      {/* 🔹 Форма створення / редагування */}
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder={
            i18n.language === "ru" ? "Название модуля" : "Назва модуля"
          }
          className="w-full px-4 py-2 rounded-xl border border-pink-300 focus:ring-1 focus:ring-pink-500 outline-none"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder={i18n.language === "ru" ? "Описание" : "Опис"}
          className="w-full px-4 py-2 rounded-xl border border-pink-300 focus:ring-1 focus:ring-pink-500 outline-none"
        />
        <input
          type="number"
          value={form.lessons}
          onChange={(e) =>
            setForm({ ...form, lessons: parseInt(e.target.value) })
          }
          placeholder={
            i18n.language === "ru"
              ? "Количество уроков"
              : "Кількість уроків"
          }
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
            className={`p-5 rounded-2xl border flex flex-col justify-between ${
              darkMode
                ? "border-fuchsia-900/30 bg-[#1a0a1f]/70"
                : "border-pink-200 bg-white/70"
            }`}
          >
            <div>
              <h4 className="font-semibold text-lg">{mod.title}</h4>
              <p className="text-sm opacity-70 mb-3">{mod.description}</p>
              <p className="text-xs opacity-60 mb-4">
                {i18n.language === "ru" ? "Уроков" : "Уроків"}: {mod.lessons}
              </p>
            </div>
            <div className="flex justify-between items-center">
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
          </div>
        ))}
      </div>
    </div>
  );
}

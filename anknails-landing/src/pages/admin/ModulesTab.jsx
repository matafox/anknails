import { useState, useEffect } from "react";
import {
  Edit3,
  PlusCircle,
  Trash2,
  Save,
  XCircle,
  Upload,
} from "lucide-react";

const BACKEND = "https://anknails-backend-production.up.railway.app";

const isBunnyGuid = (s) =>
  typeof s === "string" &&
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s);

function PreviewBunny({ guid }) {
  if (!isBunnyGuid(guid)) return null;
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`${BACKEND}/api/bunny/embed/${guid}`);
        const j = await r.json();
        if (alive) setSrc(j?.url || null);
      } catch {
        if (alive) setSrc(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [guid]);

  if (!src) return null;

  return (
    <div className="relative mt-2">
      <iframe
        src={src}
        className="w-full aspect-video rounded-lg border border-pink-200"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        referrerPolicy="origin"
      />
    </div>
  );
}

export default function ModulesTab({ darkMode, i18n }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [modules, setModules] = useState([]);
  const [expanded, setExpanded] = useState(null);

  // інлайн-редагування МОДУЛЯ
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [moduleDraft, setModuleDraft] = useState({ title: "", description: "" });

  // уроки + інлайн-редагування УРОКУ
  const [lessons, setLessons] = useState({});
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [lessonDraft, setLessonDraft] = useState({
    title: "",
    description: "",
    homework: "",
    materials: "",
    type: "theory",
    videoFile: null, // тільки файл -> Bunny
    uploadProgress: 0,
    uploading: false,
  });

  // форма "додати новий урок" під модулем
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    homework: "",
    materials: "",
    type: "theory",
    videoFile: null,
    uploadProgress: 0,
    uploading: false,
  });

  const [draggedLesson, setDraggedLesson] = useState(null);
  const [orderChangedModuleId, setOrderChangedModuleId] = useState(null);

  const t = (ua, ru) => (i18n.language === "ru" ? ru : ua);

  // --- Courses / Modules ---
  const fetchCourses = async () => {
    const res = await fetch(`${BACKEND}/api/courses`);
    const data = await res.json();
    const arr = data.courses || [];
    setCourses(arr);
    if (!selectedCourse && arr.length > 0) setSelectedCourse(arr[0].id);
  };

  const fetchModules = async (courseId) => {
    const res = await fetch(`${BACKEND}/api/modules/${courseId}?admin=true`);
    const data = await res.json();
    setModules(data.modules || []);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) fetchModules(selectedCourse);
  }, [selectedCourse]);

  // --- Lessons ---
  const fetchLessons = async (moduleId) => {
    const res = await fetch(`${BACKEND}/api/lessons/${moduleId}`);
    const data = await res.json();
    setLessons((prev) => ({ ...prev, [moduleId]: data.lessons || [] }));
  };

  // --- Module actions ---
  const startEditModule = (mod) => {
    setEditingModuleId(mod.id);
    setModuleDraft({ title: mod.title, description: mod.description || "" });
  };

  const cancelEditModule = () => {
    setEditingModuleId(null);
    setModuleDraft({ title: "", description: "" });
  };

  const saveModule = async (id) => {
    await fetch(`${BACKEND}/api/modules/update/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "anka12341",
        title: moduleDraft.title,
        description: moduleDraft.description,
      }),
    });
    await fetchModules(selectedCourse);
    cancelEditModule();
  };

  const createModule = async (title, description) => {
    await fetch(`${BACKEND}/api/modules/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "anka12341",
        course_id: selectedCourse,
        title,
        description,
      }),
    });
    await fetchModules(selectedCourse);
  };

  const deleteModule = async (id) => {
    if (!window.confirm(t("Видалити модуль?", "Удалить модуль?"))) return;
    await fetch(`${BACKEND}/api/modules/delete/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "anka12341" }),
    });
    await fetchModules(selectedCourse);
  };

  const toggleVisibleModule = async (mod) => {
    await fetch(`${BACKEND}/api/modules/update/${mod.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "anka12341",
        visible: !mod.visible,
      }),
    });
    await fetchModules(selectedCourse);
  };

  // --- Lesson drag / reorder ---
  const handleDragStart = (lesson) => setDraggedLesson(lesson);

  const handleDrop = (moduleId, targetLesson) => {
    if (!draggedLesson || draggedLesson.id === targetLesson.id) return;
    const updated = [...(lessons[moduleId] || [])];
    const fromIndex = updated.findIndex((l) => l.id === draggedLesson.id);
    const toIndex = updated.findIndex((l) => l.id === targetLesson.id);
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setLessons((prev) => ({ ...prev, [moduleId]: updated }));
    setDraggedLesson(null);
    setOrderChangedModuleId(moduleId);
  };

  const saveLessonOrder = async (moduleId) => {
    const order = (lessons[moduleId] || []).map((l, index) => ({
      id: l.id,
      position: index + 1,
    }));
    await fetch(`${BACKEND}/api/lessons/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "anka12341", order }),
    });
    setOrderChangedModuleId(null);
    alert("✅ " + t("Порядок оновлено", "Порядок обновлён"));
  };

  // --- Bunny upload (shared) ---
  const uploadToBunny = (file, setStateCb) =>
    new Promise((resolve) => {
      if (!file) return resolve(null);

      const xhr = new XMLHttpRequest();
      setStateCb((prev) => ({ ...prev, uploading: true, uploadProgress: 0 }));

      xhr.open("POST", `${BACKEND}/api/bunny_upload`, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setStateCb((prev) => ({ ...prev, uploadProgress: percent }));
        }
      };

      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300 && json.success && json.video_id) {
            resolve(json.video_id); // GUID
          } else {
            alert("❌ " + t("Помилка при завантаженні відео", "Ошибка при загрузке видео"));
            resolve(null);
          }
        } catch {
          alert("❌ " + t("Помилка при завантаженні відео", "Ошибка при загрузке видео"));
          resolve(null);
        } finally {
          setStateCb((prev) => ({ ...prev, uploading: false }));
        }
      };

      xhr.onerror = () => {
        alert("❌ " + t("Не вдалося завантажити відео на BunnyCDN", "Не удалось загрузить видео на BunnyCDN"));
        setStateCb((prev) => ({ ...prev, uploading: false }));
        resolve(null);
      };

      const formData = new FormData();
      formData.append("file", file);
      xhr.send(formData);
    });

  // --- Lesson CRUD ---
  const startEditLesson = (lesson) => {
    setEditingLessonId(lesson.id);
    setLessonDraft({
      title: lesson.title,
      description: lesson.description || "",
      homework: lesson.homework || "",
      materials: lesson.materials || "",
      type: lesson.type || "theory",
      videoFile: null,
      uploadProgress: 0,
      uploading: false,
    });
  };

  const cancelEditLesson = () => {
    setEditingLessonId(null);
    setLessonDraft({
      title: "",
      description: "",
      homework: "",
      materials: "",
      type: "theory",
      videoFile: null,
      uploadProgress: 0,
      uploading: false,
    });
  };

  const saveEditedLesson = async (moduleId, lesson) => {
    // якщо вибрано файл, заливаємо у Bunny та отримуємо GUID
    let guid = lesson.youtube_id || null;
    if (lessonDraft.videoFile) {
      const newGuid = await uploadToBunny(lessonDraft.videoFile, setLessonDraft);
      if (newGuid) guid = newGuid;
    }

    await fetch(`${BACKEND}/api/lessons/update/${lesson.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "anka12341",
        module_id: moduleId,
        title: lessonDraft.title,
        description: lessonDraft.description,
        homework: lessonDraft.homework,
        materials: lessonDraft.materials,
        type: lessonDraft.type,
        youtube: guid, // тільки Bunny GUID
      }),
    });

    await fetchLessons(moduleId);
    cancelEditLesson();
  };

  const createLesson = async (moduleId) => {
    // обовʼязково Bunny-файл → GUID
    let guid = null;
    if (newLesson.videoFile) {
      guid = await uploadToBunny(newLesson.videoFile, setNewLesson);
      if (!guid) return; // не вдалося — не створюємо урок
    } else {
      alert("⚠️ " + t("Додай відео для уроку (BunnyCDN)", "Добавь видео для урока (BunnyCDN)"));
      return;
    }

    await fetch(`${BACKEND}/api/lessons/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "anka12341",
        module_id: moduleId,
        title: newLesson.title,
        description: newLesson.description,
        homework: newLesson.homework,
        materials: newLesson.materials,
        type: newLesson.type,
        youtube: guid, // тільки Bunny GUID
      }),
    });

    setNewLesson({
      title: "",
      description: "",
      homework: "",
      materials: "",
      type: "theory",
      videoFile: null,
      uploadProgress: 0,
      uploading: false,
    });

    await fetchLessons(moduleId);
  };

  const deleteLesson = async (lessonId, moduleId) => {
    if (!window.confirm(t("Видалити урок?", "Удалить урок?"))) return;
    await fetch(`${BACKEND}/api/lessons/delete/${lessonId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "anka12341" }),
    });
    await fetchLessons(moduleId);
  };

  return (
    <div className="space-y-10">
      {/* 🏫 Вибір курсу */}
      <div className="max-w-lg">
        <label className="block font-medium mb-1">{t("Курс", "Курс")}:</label>
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

      {/* ➕ Створити новий модуль (компактна форма угорі) */}
      <CreateModuleInline
        onCreate={(title, desc) => createModule(title, desc)}
        t={t}
      />

      {/* 🔹 Список модулів */}
      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((mod) => {
          const isEditingModule = editingModuleId === mod.id;
          const modLessons = lessons[mod.id] || [];

          return (
            <div
              key={mod.id}
              className={`p-5 rounded-2xl border ${
                darkMode
                  ? "border-fuchsia-900/30 bg-[#1a0a1f]/70"
                  : "border-pink-200 bg-white/80"
              }`}
            >
              {/* Заголовок / Інлайн-редагування модуля */}
              {!isEditingModule ? (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-lg">{mod.title}</h4>
                    {mod.description && (
                      <p className="text-sm opacity-70 mt-1">{mod.description}</p>
                    )}
                    <p className="text-xs opacity-60 mt-2">
                      {t("Уроків", "Уроков")}: {mod.lessons}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => startEditModule(mod)}
                      className="text-blue-500 flex items-center gap-1"
                    >
                      <Edit3 className="w-4 h-4" />
                      {t("Редагувати", "Редактировать")}
                    </button>
                    <button
                      onClick={() => deleteModule(mod.id)}
                      className="text-red-500 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t("Видалити", "Удалить")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-3 border border-pink-200/60 bg-pink-50/60">
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-pink-300"
                    placeholder={t("Назва модуля", "Название модуля")}
                    value={moduleDraft.title}
                    onChange={(e) =>
                      setModuleDraft((s) => ({ ...s, title: e.target.value }))
                    }
                  />
                  <textarea
                    className="w-full px-3 py-2 rounded-lg border border-pink-300 mt-2"
                    placeholder={t("Опис модуля", "Описание модуля")}
                    value={moduleDraft.description}
                    onChange={(e) =>
                      setModuleDraft((s) => ({ ...s, description: e.target.value }))
                    }
                  />
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => saveModule(mod.id)}
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {t("Зберегти", "Сохранить")}
                    </button>
                    <button
                      onClick={cancelEditModule}
                      className="px-4 py-2 bg-gray-300 rounded-lg text-sm flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      {t("Скасувати", "Отменить")}
                    </button>
                  </div>
                </div>
              )}

              {/* Перемикач видимості */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm opacity-70">
                  {t("Видимий для учнів", "Видим для учеников")}:
                </span>
                <button
                  onClick={() => toggleVisibleModule(mod)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    mod.visible ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {mod.visible ? t("Відкрито", "Открыто") : t("Приховано", "Скрыто")}
                </button>
              </div>

              {/* Кнопка показати уроки */}
              <button
                onClick={() => {
                  setExpanded(expanded === mod.id ? null : mod.id);
                  if (!lessons[mod.id]) fetchLessons(mod.id);
                }}
                className="mt-3 text-pink-500 underline text-sm"
              >
                {expanded === mod.id
                  ? t("Сховати уроки", "Скрыть уроки")
                  : t("Показати уроки", "Показать уроки")}
              </button>

              {/* Секція уроків */}
              {expanded === mod.id && (
                <div className="mt-3 space-y-3 border-t border-pink-200 pt-3">
                  {modLessons.map((l) => {
                    const isEditingLesson = editingLessonId === l.id;
                    return (
                      <div
                        key={l.id}
                        draggable
                        onDragStart={() => handleDragStart(l)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(mod.id, l)}
                        className={`p-3 rounded-lg text-sm ${
                          darkMode ? "bg-fuchsia-950/40" : "bg-pink-50"
                        }`}
                      >
                        {!isEditingLesson ? (
                          <>
                            <div className="flex justify-between">
                              <div className="w-full">
                                <div className="flex items-center gap-2">
                                  <b>{l.title}</b>
                                  {l.type && (
                                    <span
                                      className={`text-xs px-2 py-[2px] rounded-full ${
                                        l.type === "practice"
                                          ? "bg-purple-200 text-purple-700"
                                          : "bg-pink-200 text-pink-700"
                                      }`}
                                    >
                                      {l.type === "practice"
                                        ? t("Практика", "Практика")
                                        : t("Теорія", "Теория")}
                                    </span>
                                  )}
                                </div>

                                {l.description && <p className="mt-1">{l.description}</p>}

                                {/* ТІЛЬКИ BUNNY */}
                                {l.youtube_id && l.youtube_id.includes("-") && (
                                  {isBunnyGuid(l.youtube_id) && <PreviewBunny guid={l.youtube_id} />} />
                                )}

                                {l.homework && (
                                  <p className="mt-2 text-xs opacity-80">
                                    📝 <b>{t("Завдання", "Задание")}:</b> {l.homework}
                                  </p>
                                )}
                                {l.materials && (
                                  <p className="mt-1 text-xs opacity-80">
                                    📁 <b>{t("Матеріали", "Материалы")}:</b> {l.materials}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => startEditLesson(l)}
                                  className="text-blue-500 text-xs flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" /> {t("ред.", "ред.")}
                                </button>
                                <button
                                  onClick={() => deleteLesson(l.id, mod.id)}
                                  className="text-red-500 text-xs flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" /> {t("вид.", "удал.")}
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          // ІНЛАЙН-РЕДАГУВАННЯ УРОКУ
                          <div className="rounded-lg border border-pink-200/70 bg-white/70 p-3">
                            <div className="grid gap-2">
                              <input
                                className="w-full px-3 py-2 border border-pink-300 rounded-lg"
                                placeholder={t("Назва уроку", "Название урока")}
                                value={lessonDraft.title}
                                onChange={(e) =>
                                  setLessonDraft((s) => ({ ...s, title: e.target.value }))
                                }
                              />
                              <textarea
                                className="w-full px-3 py-2 border border-pink-300 rounded-lg"
                                placeholder={t("Опис", "Описание")}
                                value={lessonDraft.description}
                                onChange={(e) =>
                                  setLessonDraft((s) => ({ ...s, description: e.target.value }))
                                }
                              />

                              {/* Тип уроку */}
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setLessonDraft((s) => ({ ...s, type: "theory" }))
                                  }
                                  className={`flex-1 py-2 rounded-lg font-medium ${
                                    lessonDraft.type === "theory"
                                      ? "bg-pink-500 text-white"
                                      : "bg-pink-100 text-pink-600"
                                  }`}
                                >
                                  🩷 {t("Теорія", "Теория")}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setLessonDraft((s) => ({ ...s, type: "practice" }))
                                  }
                                  className={`flex-1 py-2 rounded-lg font-medium ${
                                    lessonDraft.type === "practice"
                                      ? "bg-purple-500 text-white"
                                      : "bg-purple-100 text-purple-600"
                                  }`}
                                >
                                  💜 {t("Практика", "Практика")}
                                </button>
                              </div>

                              <input
                                className="w-full px-3 py-2 border border-pink-300 rounded-lg"
                                placeholder={t("Завдання", "Задание")}
                                value={lessonDraft.homework}
                                onChange={(e) =>
                                  setLessonDraft((s) => ({ ...s, homework: e.target.value }))
                                }
                              />

                              <input
                                className="w-full px-3 py-2 border border-pink-300 rounded-lg"
                                placeholder={t(
                                  "Матеріали (посилання або короткий опис)",
                                  "Материалы (ссылка или краткое описание)"
                                )}
                                value={lessonDraft.materials}
                                onChange={(e) =>
                                  setLessonDraft((s) => ({ ...s, materials: e.target.value }))
                                }
                              />

                              {/* ТІЛЬКИ Bunny-файл */}
                              <label className="block text-sm font-medium mt-1">
                                🎥 {t("Відео BunnyCDN (оновити)", "Видео BunnyCDN (обновить)")}
                              </label>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                  setLessonDraft((s) => ({
                                    ...s,
                                    videoFile: e.target.files?.[0] || null,
                                  }))
                                }
                                className="w-full border border-pink-300 rounded-lg p-2"
                              />
                              {lessonDraft.uploading && (
                                <ProgressBar
                                  value={lessonDraft.uploadProgress}
                                  t={t}
                                />
                              )}

                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  onClick={() => saveEditedLesson(mod.id, l)}
                                  disabled={lessonDraft.uploading}
                                  className="px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold flex items-center gap-2"
                                >
                                  <Save className="w-4 h-4" />
                                  {t("Зберегти", "Сохранить")}
                                </button>
                                <button
                                  onClick={cancelEditLesson}
                                  className="px-4 py-2 bg-gray-300 rounded-lg text-sm flex items-center gap-2"
                                >
                                  <XCircle className="w-4 h-4" />
                                  {t("Скасувати", "Отменить")}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Кнопка зберегти порядок (якщо мінявся саме в цьому модулі) */}
                  {orderChangedModuleId === mod.id && (
                    <button
                      onClick={() => saveLessonOrder(mod.id)}
                      className="w-full mt-1 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {t("Зберегти порядок", "Сохранить порядок")}
                    </button>
                  )}

                  {/* ➕ ДОДАТИ НОВИЙ УРОК (тільки Bunny) */}
                  <div
                    className={`p-3 rounded-lg border mt-3 ${
                      darkMode ? "border-fuchsia-900/30" : "border-pink-200"
                    }`}
                  >
                    <h5 className="font-semibold mb-2">{t("Новий урок", "Новый урок")}</h5>
                    <div className="grid gap-2">
                      <input
                        className="w-full px-3 py-2 border border-pink-300 rounded-lg"
                        placeholder={t("Назва уроку", "Название урока")}
                        value={newLesson.title}
                        onChange={(e) =>
                          setNewLesson((s) => ({ ...s, title: e.target.value }))
                        }
                      />
                      <textarea
                        className="w-full px-3 py-2 border border-pink-300 rounded-lg"
                        placeholder={t("Опис", "Описание")}
                        value={newLesson.description}
                        onChange={(e) =>
                          setNewLesson((s) => ({ ...s, description: e.target.value }))
                        }
                      />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setNewLesson((s) => ({ ...s, type: "theory" }))
                          }
                          className={`flex-1 py-2 rounded-lg font-medium ${
                            newLesson.type === "theory"
                              ? "bg-pink-500 text-white"
                              : "bg-pink-100 text-pink-600"
                          }`}
                        >
                          🩷 {t("Теорія", "Теория")}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setNewLesson((s) => ({ ...s, type: "practice" }))
                          }
                          className={`flex-1 py-2 rounded-lg font-medium ${
                            newLesson.type === "practice"
                              ? "bg-purple-500 text-white"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          💜 {t("Практика", "Практика")}
                        </button>
                      </div>

                      <input
                        className="w-full px-3 py-2 border border-pink-300 rounded-lg"
                        placeholder={t("Завдання", "Задание")}
                        value={newLesson.homework}
                        onChange={(e) =>
                          setNewLesson((s) => ({ ...s, homework: e.target.value }))
                        }
                      />
                      <input
                        className="w-full px-3 py-2 border border-pink-300 rounded-lg"
                        placeholder={t(
                          "Матеріали (посилання або короткий опис)",
                          "Материалы (ссылка или краткое описание)"
                        )}
                        value={newLesson.materials}
                        onChange={(e) =>
                          setNewLesson((s) => ({ ...s, materials: e.target.value }))
                        }
                      />

                      <label className="block text-sm font-medium">
                        🎥 {t("Відео BunnyCDN (обовʼязково)", "Видео BunnyCDN (обязательно)")}
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          setNewLesson((s) => ({
                            ...s,
                            videoFile: e.target.files?.[0] || null,
                          }))
                        }
                        className="w-full border border-pink-300 rounded-lg p-2"
                      />
                      {newLesson.uploading && (
                        <ProgressBar value={newLesson.uploadProgress} t={t} />
                      )}

                      <button
                        onClick={() => createLesson(mod.id)}
                        disabled={newLesson.uploading}
                        className="mt-1 flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold"
                      >
                        <PlusCircle className="w-4 h-4" />
                        {t("Додати урок", "Добавить урок")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --- Допоміжні компоненти --- */

function CreateModuleInline({ onCreate, t }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onCreate(title.trim(), desc.trim());
    setTitle("");
    setDesc("");
    setOpen(false);
  };

  return (
    <div className="max-w-lg">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          {t("Створити модуль", "Создать модуль")}
        </button>
      ) : (
        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-pink-200 p-4 mt-1 bg-white/70">
          <input
            className="w-full px-4 py-2 rounded-xl border border-pink-300"
            placeholder={t("Назва модуля", "Название модуля")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full px-4 py-2 rounded-xl border border-pink-300"
            placeholder={t("Опис модуля", "Описание модуля")}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {t("Зберегти", "Сохранить")}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setTitle("");
                setDesc("");
              }}
              className="px-4 py-2 bg-gray-300 rounded-lg text-sm flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              {t("Скасувати", "Отменить")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function ProgressBar({ value, t }) {
  return (
    <div style={{ marginTop: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "#d63384",
          marginBottom: "4px",
        }}
      >
        <span>{t("Завантаження", "Загрузка")}...</span>
        <span>{value}%</span>
      </div>
      <div
        style={{
          width: "100%",
          height: "6px",
          backgroundColor: "#f8d7e5",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "6px",
            width: `${value || 0}%`,
            background: "#d63384",
            transition: "width 0.3s",
          }}
        ></div>
      </div>
    </div>
  );
}

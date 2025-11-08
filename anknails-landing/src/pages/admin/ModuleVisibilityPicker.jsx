// src/pages/admin/ModuleVisibilityPicker.jsx
import { useEffect, useMemo, useState } from "react";
import { X, Save, Search, Users as UsersIcon, CheckSquare } from "lucide-react";

export default function ModuleVisibilityPicker({
  BACKEND,
  moduleId,
  initialVisible,     // boolean з картки модуля (fallback)
  t,                  // функція локалізації t(ua, ru)
  onClose,            // закрити модалку без збереження
  onSaved,            // колбек після успішного збереження (оновити список модулів)
}) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);              // всі користувачі
  const [mode, setMode] = useState("all");             // 'all' | 'none' | 'selected'
  const [selected, setSelected] = useState(new Set()); // обрані user_id
  const [q, setQ] = useState("");

  // 1) Підвантаження поточного стану видимості + списку користувачів
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Список користувачів (очікуємо { users: [{id, name, email, username}] })
        const u = await fetch(`${BACKEND}/api/users`);
        const uj = await u.json();
        const list = Array.isArray(uj?.users) ? uj.users : [];
        if (!alive) return;
        setUsers(list);

        // Поточна конфігурація видимості (очікуємо { mode: 'all'|'none'|'selected', user_ids: number[] })
        let fetchedMode = null;
        let fetchedSelected = [];
        try {
          const r = await fetch(`${BACKEND}/api/modules/visibility/${moduleId}?admin=true`);
          if (r.ok) {
            const j = await r.json();
            fetchedMode = j?.mode || null;
            fetchedSelected = Array.isArray(j?.user_ids) ? j.user_ids : [];
          }
        } catch {
          // ignore
        }

        // Якщо бекенд ще не повертає конфіг — fallback із initialVisible
        const effectiveMode = fetchedMode || (initialVisible ? "all" : "none");
        setMode(effectiveMode);
        setSelected(new Set(fetchedSelected));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [BACKEND, moduleId, initialVisible]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return users;
    return users.filter(u => {
      const name = (u.name || u.full_name || u.username || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      return name.includes(qq) || email.includes(qq);
    });
  }, [q, users]);

  const toggleOne = (id) => {
    setSelected(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const selectAllFiltered = () => {
    setSelected(prev => {
      const s = new Set(prev);
      filtered.forEach(u => s.add(u.id));
      return s;
    });
  };

  const clearAll = () => setSelected(new Set());

  // 🔒 ЄДИНИЙ шлях збереження для всіх режимів — /api/modules/visibility/{id}
  const save = async () => {
    try {
      const body =
        mode === "selected"
          ? { token: "anka12341", mode: "selected", user_ids: Array.from(selected) }
          : { token: "anka12341", mode }; // "all" або "none"

      const r = await fetch(`${BACKEND}/api/modules/visibility/${moduleId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        const txt = await r.text();
        throw new Error(txt || "Failed to save visibility");
      }

      onSaved?.();
      onClose?.();
    } catch (e) {
      alert("❌ " + t("Не вдалося зберегти видимість", "Не удалось сохранить видимость"));
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* modal */}
      <div className="absolute inset-x-0 top-10 mx-auto w-[min(920px,95vw)] rounded-2xl border border-pink-200 bg-white shadow-xl overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-pink-200 bg-pink-50/60">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-pink-600" />
            <h3 className="font-semibold">
              {t("Видимість модуля", "Видимость модуля")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-pink-100"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-pink-600" />
          </button>
        </div>

        {/* body */}
        <div className="p-5">
          {/* режим */}
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setMode("all")}
              className={`px-4 py-3 rounded-xl border text-left ${
                mode === "all"
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="font-semibold">
                {t("Відкрити для всіх", "Открыть для всех")}
              </div>
              <div className="text-sm opacity-70">
                {t("Модуль бачать усі учні", "Модуль видят все ученики")}
              </div>
            </button>

            <button
              onClick={() => setMode("none")}
              className={`px-4 py-3 rounded-xl border text-left ${
                mode === "none"
                  ? "border-gray-400 bg-gray-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="font-semibold">
                {t("Приховати для всіх", "Скрыть для всех")}
              </div>
              <div className="text-sm opacity-70">
                {t("Ніхто не бачить модуль", "Никто не видит модуль")}
              </div>
            </button>

            <button
              onClick={() => setMode("selected")}
              className={`px-4 py-3 rounded-xl border text-left ${
                mode === "selected"
                  ? "border-pink-400 bg-pink-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="font-semibold">
                {t("Показати обраним", "Показать избранным")}
              </div>
              <div className="text-sm opacity-70">
                {t("Видно лише вибраним користувачам", "Видно только выбранным пользователям")}
              </div>
            </button>
          </div>

          {/* список користувачів (тільки для режиму selected) */}
          {mode === "selected" && (
            <div className="border rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 p-3 border-b bg-pink-50/50">
                <Search className="w-4 h-4 text-pink-600" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("Пошук (імʼя/емейл)", "Поиск (имя/емейл)")}
                  className="flex-1 bg-transparent outline-none"
                />
                <div className="text-xs opacity-70">
                  {t("Обрано", "Выбрано")}: {selected.size}
                </div>
              </div>

              <div className="max-h-[50vh] overflow-auto divide-y">
                {loading ? (
                  <div className="p-4 text-sm opacity-70">
                    {t("Завантаження користувачів...", "Загрузка пользователей...")}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="p-4 text-sm opacity-70">
                    {t("Нічого не знайдено", "Ничего не найдено")}
                  </div>
                ) : (
                  filtered.map(u => {
                    const name = u.name || u.full_name || u.username || ("ID " + u.id);
                    const email = u.email || "";
                    const picked = selected.has(u.id);
                    return (
                      <label
                        key={u.id}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-pink-50/50"
                      >
                        <input
                          type="checkbox"
                          checked={picked}
                          onChange={() => toggleOne(u.id)}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{name}</div>
                          {email && <div className="text-xs opacity-70">{email}</div>}
                        </div>
                        {picked && <CheckSquare className="w-4 h-4 text-pink-600" />}
                      </label>
                    );
                  })
                )}
              </div>

              <div className="flex items-center justify-between p-3 border-t bg-white">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAllFiltered}
                    className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-sm"
                  >
                    {t("Вибрати все (фільтр)", "Выбрать всё (фильтр)")}
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                  >
                    {t("Очистити", "Очистить")}
                  </button>
                </div>
                <div className="text-xs opacity-70">
                  {t("Вибрано користувачів", "Выбрано пользователей")}: {selected.size}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
          >
            {t("Скасувати", "Отменить")}
          </button>
          <button
            onClick={save}
            disabled={mode === "selected" && selected.size === 0}
            className="px-4 py-2 bg-pink-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {t("Зберегти", "Сохранить")}
          </button>
        </div>
      </div>
    </div>
  );
}

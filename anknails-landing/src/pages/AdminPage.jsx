import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Users,
  Image,
  LogOut,
  Settings,
  UploadCloud,
  Menu,
  X,
  Edit3,
  Save,
} from "lucide-react";

export default function AdminPage() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("modules");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const BACKEND = "https://anknails-backend-production.up.railway.app";

  // 🔐 Перевірка доступу
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token !== "true") window.location.href = "/login";
  }, []);

  // 🌓 Тема
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // 👥 Завантаження користувачів
  const loadUsers = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/users`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Помилка завантаження користувачів:", err);
    }
  };

  useEffect(() => {
    if (["students", "settings"].includes(activeTab)) loadUsers();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/";
  };

  const tabs = [
    { id: "modules", label: i18n.language === "ru" ? "Модули курса" : "Модулі курсу", icon: BookOpen },
    { id: "students", label: i18n.language === "ru" ? "Ученики" : "Учні", icon: Users },
    { id: "banner", label: i18n.language === "ru" ? "Баннер" : "Банер", icon: Image },
    { id: "settings", label: i18n.language === "ru" ? "Настройки" : "Налаштування", icon: Settings },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${
        darkMode
          ? "bg-gradient-to-br from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      {/* ☰ Бургер справа */}
      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 bg-pink-500 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* 🩷 Бокове меню */}
      <aside
        className={`fixed md:static top-0 right-0 h-full md:h-auto w-64 p-6 flex flex-col justify-between border-l z-40 transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        } ${
          darkMode
            ? "border-fuchsia-900/30 bg-[#1a0a1f]/80"
            : "border-pink-200 bg-white/80"
        } backdrop-blur-xl`}
      >
        <div>
          <button
            onClick={() => setMenuOpen(false)}
            className="md:hidden text-pink-400 mb-4 self-end"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 text-transparent bg-clip-text mb-6 text-center md:text-left">
            ANK Studio LMS
          </h2>

          <nav className="space-y-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? darkMode
                      ? "bg-pink-500/30 text-fuchsia-100 border border-pink-400/40"
                      : "bg-pink-100 text-pink-700 border border-pink-300"
                    : darkMode
                    ? "hover:bg-fuchsia-900/20 text-fuchsia-200"
                    : "hover:bg-pink-50 text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-pink-500 hover:text-rose-500 transition"
        >
          <LogOut className="w-4 h-4" />
          {i18n.language === "ru" ? "Выйти" : "Вийти"}
        </button>
      </aside>

      {/* 🌸 Контент */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {activeTab === "modules" && (
          <section>
            <h2 className="text-2xl font-bold mb-6">
              {i18n.language === "ru" ? "Модули курса" : "Модулі курсу"}
            </h2>
            <ModuleEditor darkMode={darkMode} i18n={i18n} />
          </section>
        )}

        {activeTab === "students" && (
          <StudentsTab i18n={i18n} users={users} loadUsers={loadUsers} />
        )}

        {activeTab === "banner" && (
          <section>
            <h2 className="text-2xl font-bold mb-6">
              {i18n.language === "ru" ? "Редактирование баннера" : "Редагування банера"}
            </h2>
            <BannerEditor darkMode={darkMode} i18n={i18n} />
          </section>
        )}

        {activeTab === "settings" && (
          <SettingsTab i18n={i18n} loadUsers={loadUsers} />
        )}
      </main>
    </div>
  );
}

/* 👩‍🎓 STUDENTS TAB — таблиця учнів з редагуванням імен */
function StudentsTab({ i18n, users, loadUsers }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";
  const [savingId, setSavingId] = useState(null);

  const handleNameSave = async (id, name) => {
    if (!name.trim()) return;
    setSavingId(id);
    await fetch(`${BACKEND}/api/users/update/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "anka12341", name }),
    });
    await loadUsers();
    setSavingId(null);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">
        {i18n.language === "ru" ? "Ученики" : "Учні"}
      </h2>
      {users.length ? (
        <table className="min-w-[700px] w-full border border-pink-200 rounded-xl overflow-hidden">
          <thead className="bg-pink-100">
            <tr>
              <th className="py-2 px-3 text-left">ID</th>
              <th className="py-2 px-3 text-left">Email</th>
              <th className="py-2 px-3 text-left">Ім’я</th>
              <th className="py-2 px-3 text-left">Доступ до</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-pink-50">
                <td className="py-2 px-3">{u.id}</td>
                <td className="py-2 px-3">{u.email}</td>
                <td className="py-2 px-3">
                  <input
                    defaultValue={u.name || ""}
                    placeholder="Ім’я..."
                    onBlur={(e) => handleNameSave(u.id, e.target.value)}
                    className="px-2 py-1 rounded-lg border border-pink-300 focus:ring-1 focus:ring-pink-500 outline-none"
                  />
                  {savingId === u.id && (
                    <Save className="w-4 h-4 text-pink-500 inline ml-2 animate-pulse" />
                  )}
                </td>
                <td className="py-2 px-3">
                  {new Date(u.expires_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center opacity-70 mt-4">
          {i18n.language === "ru"
            ? "Пользователи не найдены"
            : "Користувачів ще немає"}
        </p>
      )}
    </section>
  );
}

/* ⚙️ SETTINGS TAB — створення акаунтів */
function SettingsTab({ i18n, loadUsers }) {
  const BACKEND = "https://anknails-backend-production.up.railway.app";

  const handleCreate = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const days = e.target.days.value;
    const res = await fetch(`${BACKEND}/api/users/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "anka12341", email, days: parseInt(days) }),
    });
    const data = await res.json();
    if (data.success) {
      e.target.reset();
      await loadUsers();
    }
  };

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">
        {i18n.language === "ru"
          ? "Создать временный аккаунт"
          : "Створити тимчасовий акаунт"}
      </h3>
      <form onSubmit={handleCreate} className="space-y-4 max-w-md">
        <input
          name="email"
          type="email"
          required
          placeholder="user@example.com"
          className="w-full px-4 py-2 rounded-xl border border-pink-300 focus:ring-1 focus:ring-pink-500 outline-none"
        />
        <input
          name="days"
          type="number"
          defaultValue="7"
          className="w-full px-4 py-2 rounded-xl border border-pink-300 focus:ring-1 focus:ring-pink-500 outline-none"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white"
        >
          {i18n.language === "ru" ? "Создать" : "Створити"}
        </button>
      </form>
    </section>
  );
}

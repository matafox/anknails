import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Users,
  Image,
  LogOut,
  PlusCircle,
  Settings,
  UploadCloud,
  Menu,
  X,
} from "lucide-react";

export default function AdminPage() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("modules");
  const [darkMode, setDarkMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

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
  useEffect(() => {
    if (activeTab === "settings") {
      fetch("https://anknails-backend-production.up.railway.app/api/users")
        .then((res) => res.json())
        .then((data) => setUsers(data.users))
        .catch((err) => console.error("Помилка завантаження користувачів:", err));
    }
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
      {/* ☰ Бургер-кнопка справа */}
      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 bg-pink-500 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* 🩷 Бокове меню (відкривається з правого краю) */}
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
          {/* ✕ Кнопка закриття */}
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
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(255,0,128,0.3)]">
              <PlusCircle className="w-5 h-5" />
              {i18n.language === "ru" ? "Добавить модуль" : "Додати модуль"}
            </button>
          </section>
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
          <section>
            <h2 className="text-2xl font-bold mb-6">
              {i18n.language === "ru" ? "Настройки" : "Налаштування"}
            </h2>

            <div className="max-w-md space-y-5">
              <h3 className="text-xl font-semibold mb-4">
                {i18n.language === "ru"
                  ? "Создать временный аккаунт"
                  : "Створити тимчасовий акаунт"}
              </h3>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = e.target.email.value;
                  const days = e.target.days.value;

                  const res = await fetch(
                    "https://anknails-backend-production.up.railway.app/api/users/create",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        token: "anka12341",
                        email,
                        days: parseInt(days),
                      }),
                    }
                  );

                  const data = await res.json();
                  alert(JSON.stringify(data, null, 2));
                  setUsers((prev) => [...prev, data.user]);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email користувача
                  </label>
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
                    Днів доступу
                  </label>
                  <input
                    name="days"
                    type="number"
                    defaultValue="7"
                    className="w-full px-4 py-2 rounded-xl border border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(255,0,128,0.3)]"
                >
                  {i18n.language === "ru" ? "Создать" : "Створити"}
                </button>
              </form>
            </div>

            {/* 📋 Таблиця користувачів */}
            <div className="mt-8 overflow-x-auto">
              {users.length > 0 ? (
                <table className="min-w-[600px] w-full border border-pink-200 rounded-xl overflow-hidden">
                  <thead className="bg-pink-100">
                    <tr>
                      <th className="py-2 px-3 text-left">ID</th>
                      <th className="py-2 px-3 text-left">Email</th>
                      <th className="py-2 px-3 text-left">Пароль</th>
                      <th className="py-2 px-3 text-left">Доступ до</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t hover:bg-pink-50">
                        <td className="py-2 px-3">{u.id}</td>
                        <td className="py-2 px-3">{u.email}</td>
                        <td className="py-2 px-3 font-mono">{u.password}</td>
                        <td className="py-2 px-3">
                          {new Date(u.expires_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="opacity-70 mt-4">
                  {i18n.language === "ru"
                    ? "Пользователи не найдены"
                    : "Користувачів ще немає"}
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* 🎀 Компонент редагування банера */
function BannerEditor({ darkMode, i18n }) {
  const [banner, setBanner] = useState({ title: "", image_url: "", active: true });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch("https://anknails-backend-production.up.railway.app/api/banner")
      .then((res) => res.json())
      .then((data) => setBanner(data))
      .catch(() => console.error("Помилка завантаження банера"));
  }, []);

  const uploadToImgur = async () => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: { Authorization: "Client-ID 8f3cb6e4c248b26" },
      body: formData,
    });
    const data = await res.json();
    return data?.data?.link || null;
  };

  const handleSave = async () => {
    setLoading(true);
    let imageUrl = banner.image_url;
    if (file) {
      imageUrl = await uploadToImgur();
      setBanner((b) => ({ ...b, image_url: imageUrl }));
    }

    await fetch("https://anknails-backend-production.up.railway.app/api/banner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "anka12341", banner: { ...banner, image_url: imageUrl } }),
    });

    setLoading(false);
    alert(i18n.language === "ru" ? "Баннер обновлён" : "Банер оновлено");
  };

  return (
    <div
      className={`max-w-lg p-6 rounded-2xl border ${
        darkMode
          ? "border-fuchsia-900/30 bg-[#1a0a1f]/70"
          : "border-pink-200 bg-white/70"
      }`}
    >
      <label className="block text-sm font-medium mb-2">
        {i18n.language === "ru" ? "Заголовок баннера" : "Заголовок банера"}
      </label>
      <input
        value={banner.title}
        onChange={(e) => setBanner({ ...banner, title: e.target.value })}
        className="w-full mb-4 px-4 py-2 rounded-xl border border-pink-300 focus:ring-1 focus:ring-pink-500 outline-none"
      />

      <label className="block text-sm font-medium mb-2">
        {i18n.language === "ru" ? "Загрузить изображение" : "Завантажити зображення"}
      </label>

      <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-dashed border-pink-400 mb-4 cursor-pointer hover:bg-pink-50 transition">
        <UploadCloud className="w-6 h-6 text-pink-500" />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm"
        />
        {file && <p className="text-sm opacity-80">{file.name}</p>}
      </div>

      {banner.image_url && (
        <img
          src={banner.image_url}
          alt="Preview"
          className="w-full rounded-xl mb-4 border border-pink-200"
        />
      )}

      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={banner.active}
          onChange={(e) => setBanner({ ...banner, active: e.target.checked })}
        />
        {i18n.language === "ru" ? "Активен" : "Активний"}
      </label>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(255,0,128,0.3)]"
      >
        {loading
          ? i18n.language === "ru"
            ? "Сохранение..."
            : "Збереження..."
          : i18n.language === "ru"
          ? "Сохранить"
          : "Зберегти"}
      </button>
    </div>
  );
}

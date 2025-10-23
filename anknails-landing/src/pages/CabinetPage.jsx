import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LogOut,
  User,
  Menu,
  X,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// 🎥 Безпечний компонент YouTube (no-cookie)
const SafeYoutube = ({ url }) => {
  if (!url) return null;

  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match ? match[1] : null;

  if (!videoId)
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        ❌ Невірне посилання на YouTube
      </p>
    );

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden border border-pink-300 shadow-md">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`}
        allowFullScreen
        loading="lazy"
        className="w-full h-full"
      />
    </div>
  );
};

export default function CabinetPage() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [banner, setBanner] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const BACKEND = "https://anknails-backend-production.up.railway.app";

  // 🌓 Тема
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // 🧠 Авторизація + користувач
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const email = localStorage.getItem("user_email");
    const expires = localStorage.getItem("expires_at");

    if (!token || !email || !expires) {
      window.location.href = "/login";
      return;
    }

    const expiryDate = new Date(expires);
    if (expiryDate < new Date()) {
      localStorage.clear();
      alert(
        i18n.language === "ru"
          ? "Срок действия аккаунта истек"
          : "Термін дії акаунта минув"
      );
      window.location.href = "/login";
      return;
    }

    fetch(`${BACKEND}/api/users`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.users?.find((u) => u.email === email);
        setUser({
          email,
          name: found?.name || null,
          expires_at: new Date(found?.expires_at || expires).toLocaleDateString(),
          active: found?.active ?? true,
        });
      })
      .catch(() =>
        setUser({
          email,
          name: null,
          expires_at: expiryDate.toLocaleDateString(),
          active: true,
        })
      );
  }, [i18n.language]);

  // 🎀 Банер
  useEffect(() => {
    fetch(`${BACKEND}/api/banner`)
      .then((res) => res.json())
      .then((data) => setBanner(data))
      .catch(() => console.error("Помилка завантаження банера"));
  }, []);

  // 📘 Модулі
  useEffect(() => {
    fetch(`${BACKEND}/api/modules`)
      .then((res) => res.json())
      .then((data) => setModules(data.modules || []))
      .catch(() => console.error("Помилка завантаження модулів"));
  }, []);

  const fetchLessons = async (moduleId) => {
    try {
      const res = await fetch(`${BACKEND}/api/lessons/${moduleId}`);
      const data = await res.json();
      setLessons((prev) => ({ ...prev, [moduleId]: data.lessons || [] }));
    } catch (err) {
      console.error("Помилка завантаження уроків:", err);
    }
  };

  const handleToggleModule = (id) => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      if (!lessons[id]) fetchLessons(id);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (!user) return null;
  const displayName = user.name?.trim() || user.email;

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${
        darkMode
          ? "bg-gradient-to-br from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      {/* 📱 Мобільна шапка */}
      <header
        className={`md:hidden flex items-center justify-between px-5 py-4 border-b ${
          darkMode
            ? "border-fuchsia-900/30 bg-[#1a0a1f]/70"
            : "border-pink-200 bg-white/80"
        } backdrop-blur-xl sticky top-0 z-20`}
      >
        <h1 className="text-lg font-bold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 bg-clip-text text-transparent">
          ANK Studio
        </h1>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* 🩷 Меню */}
      <aside
        className={`md:w-72 md:static fixed top-0 left-0 h-full md:h-auto transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform duration-300 z-10 md:z-0 p-6 border-r backdrop-blur-xl ${
          darkMode
            ? "border-fuchsia-900/30 bg-[#1a0a1f]/70"
            : "border-pink-200 bg-white/70"
        }`}
      >
        <div className="flex flex-col items-center text-center md:mt-0 mt-12">
          <User className="w-16 h-16 text-pink-500 mb-2" />
          <h2 className="text-lg font-bold">{displayName}</h2>
          <p className="text-sm opacity-70">
            {i18n.language === "ru" ? "Доступ до:" : "Доступ до:"}{" "}
            {user.expires_at}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-[1.03] transition-all shadow-[0_0_15px_rgba(255,0,128,0.3)]"
        >
          <LogOut className="w-5 h-5" />
          {i18n.language === "ru" ? "Выйти" : "Вийти"}
        </button>
      </aside>

      {/* 🌸 Контент */}
      <main className="flex-1 flex flex-col p-5 md:p-10">
        <div className="flex-grow">
          {/* 🎀 Банер */}
          {banner && banner.active && (
            <div className="rounded-2xl overflow-hidden mb-8 shadow-[0_0_25px_rgba(255,0,128,0.25)]">
              {banner.image_url && (
                <img
                  src={banner.image_url}
                  alt="Banner"
                  className="w-full h-48 md:h-64 object-cover"
                />
              )}
              <div className="p-4 text-center bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-base md:text-lg">
                {banner.title}
              </div>
            </div>
          )}

          {/* 📘 Модулі */}
          {modules.length > 0 ? (
            <div className="space-y-4">
              {modules.map((mod) => (
                <div
                  key={mod.id}
                  className={`rounded-2xl border transition-all ${
                    darkMode
                      ? "border-fuchsia-900/30 bg-[#1a0a1f]/70"
                      : "border-pink-200 bg-white/80"
                  }`}
                >
                  {/* Заголовок модуля */}
                  <div
                    className="flex justify-between items-center p-5 cursor-pointer"
                    onClick={() => handleToggleModule(mod.id)}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-6 h-6 text-pink-500" />
                      <div>
                        <h3 className="text-lg font-semibold">{mod.title}</h3>
                        <p className="text-sm opacity-70">{mod.description}</p>
                      </div>
                    </div>
                    {expanded === mod.id ? (
                      <ChevronUp className="w-5 h-5 text-pink-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-pink-500" />
                    )}
                  </div>

                  {/* 📚 Уроки */}
                  {expanded === mod.id && (
                    <div className="p-5 border-t border-pink-200/30 space-y-5">
                      {lessons[mod.id]?.length ? (
                        lessons[mod.id].map((l) => (
                          <div
                            key={l.id}
                            className="p-4 rounded-xl border border-pink-200/50 bg-white/50 shadow-sm"
                          >
                            <h4 className="font-semibold text-pink-600 mb-2">
                              {l.title}
                            </h4>

                            {/* 🎥 YouTube відео */}
                            {l.youtube || l.embed_url ? (
                              <div className="mb-3">
                                <SafeYoutube url={l.youtube || l.embed_url} />
                              </div>
                            ) : null}

                            {l.description && (
                              <p className="text-sm opacity-80 mb-2">
                                {l.description}
                              </p>
                            )}

                            {l.homework && (
                              <p className="text-sm mt-2">
                                <span className="font-semibold text-pink-500">
                                  📝{" "}
                                  {i18n.language === "ru"
                                    ? "Домашнее задание:"
                                    : "Домашнє завдання:"}
                                </span>{" "}
                                {l.homework}
                              </p>
                            )}

                            {l.materials && (
                              <p className="text-sm mt-2">
                                <span className="font-semibold text-pink-500">
                                  📚{" "}
                                  {i18n.language === "ru"
                                    ? "Материалы:"
                                    : "Матеріали:"}
                                </span>{" "}
                                {l.materials}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm opacity-60 text-center">
                          {i18n.language === "ru"
                            ? "Уроки ще не додані"
                            : "Уроки ще не додані"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 opacity-70">
              <p className="text-lg">
                {i18n.language === "ru"
                  ? "Модули пока не добавлены"
                  : "Модулі ще не додані"}
              </p>
            </div>
          )}
        </div>

        {/* 🩶 Футер */}
        <footer className="mt-auto text-sm opacity-60 text-center py-6">
          ANK Studio LMS © {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}

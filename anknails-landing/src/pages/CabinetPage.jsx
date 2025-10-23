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
  PlayCircle,
} from "lucide-react";

// 🎥 Безпечний YouTube
const SafeYoutube = ({ url }) => {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match ? match[1] : null;
  if (!videoId) return null;

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden border border-pink-300 shadow-md">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?controls=1&modestbranding=1&rel=0&showinfo=0&fs=0&disablekb=1&iv_load_policy=3&cc_load_policy=0`}
        allow="autoplay; fullscreen"
        loading="lazy"
        className="w-full h-full"
      />
    </div>
  );
};

export default function CabinetPage() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
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

  // 🧠 Користувач
  useEffect(() => {
    const email = localStorage.getItem("user_email");
    const expires = localStorage.getItem("expires_at");
    if (!email || !expires) {
      window.location.href = "/login";
      return;
    }

    setUser({
      email,
      name: localStorage.getItem("user_name"),
      expires_at: new Date(expires).toLocaleDateString(),
    });
  }, []);

  // 📘 Модулі
  useEffect(() => {
    fetch(`${BACKEND}/api/modules`)
      .then((res) => res.json())
      .then((data) => setModules(data.modules || []));
  }, []);

  const fetchLessons = async (moduleId) => {
    const res = await fetch(`${BACKEND}/api/lessons/${moduleId}`);
    const data = await res.json();
    setLessons((prev) => ({ ...prev, [moduleId]: data.lessons || [] }));
  };

  const toggleModule = (id) => {
    if (expanded === id) setExpanded(null);
    else {
      setExpanded(id);
      if (!lessons[id]) fetchLessons(id);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <div
      className={`min-h-screen flex ${
        darkMode
          ? "bg-gradient-to-br from-[#0c0016] via-[#1a0a1f] to-[#0c0016] text-fuchsia-100"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800"
      }`}
    >
      {/* 📱 Мобільна шапка */}
      <header
        className={`md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-5 py-4 border-b backdrop-blur-xl z-20 ${
          darkMode
            ? "border-fuchsia-900/30 bg-[#1a0a1f]/80"
            : "border-pink-200 bg-white/70"
        }`}
      >
        <h1 className="font-bold bg-gradient-to-r from-fuchsia-500 to-rose-400 bg-clip-text text-transparent">
          ANK Studio
        </h1>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* 📚 Бокове меню */}
      <aside
        className={`w-72 flex-shrink-0 fixed md:static top-0 h-screen md:h-auto overflow-y-auto transition-transform duration-300 z-10 md:z-0 border-r backdrop-blur-xl ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${
          darkMode
            ? "border-fuchsia-900/30 bg-[#1a0a1f]/80"
            : "border-pink-200 bg-white/80"
        }`}
      >
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <User className="w-16 h-16 text-pink-500 mb-2" />
            <h2 className="font-bold text-lg">
              {user.name || user.email.split("@")[0]}
            </h2>
            <p className="text-sm opacity-70">
              {i18n.language === "ru" ? "Доступ до:" : "Доступ до:"}{" "}
              {user.expires_at}
            </p>
          </div>

          {/* Модулі */}
          <div className="space-y-2">
            {modules.map((mod) => (
              <div key={mod.id}>
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition font-semibold text-pink-600"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {mod.title}
                  </span>
                  {expanded === mod.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Уроки */}
                {expanded === mod.id && (
                  <div className="ml-6 mt-2 space-y-1 border-l border-pink-200/30 pl-3">
                    {lessons[mod.id]?.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          setSelectedLesson(l);
                          setMenuOpen(false);
                        }}
                        className={`w-full text-left text-sm px-2 py-1 rounded-md hover:bg-pink-500/20 flex items-center gap-2 transition ${
                          selectedLesson?.id === l.id
                            ? "bg-pink-500/20 text-pink-600"
                            : "opacity-80"
                        }`}
                      >
                        <PlayCircle className="w-3 h-3" /> {l.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 w-full py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-[1.03] transition-all"
          >
            <LogOut className="inline w-4 h-4 mr-1" />
            {i18n.language === "ru" ? "Выйти" : "Вийти"}
          </button>
        </div>
      </aside>

      {/* 🌸 Контент */}
      <main className="flex-1 p-5 md:p-10 mt-16 md:mt-0 overflow-y-auto">
        {!selectedLesson ? (
          <div className="flex items-center justify-center h-full text-center opacity-70">
            <p className="text-lg">
              {i18n.language === "ru"
                ? "Выберите урок в меню слева"
                : "Оберіть урок у меню зліва"}
            </p>
          </div>
        ) : (
          <div
            className={`max-w-4xl mx-auto p-6 rounded-2xl shadow-lg ${
              darkMode
                ? "bg-[#1a0a1f]/70 border border-fuchsia-900/40"
                : "bg-white/80 border border-pink-200"
            }`}
          >
            <h2 className="text-2xl font-bold text-pink-600 mb-4">
              {selectedLesson.title}
            </h2>

            {selectedLesson.youtube && (
              <div className="mb-6">
                <SafeYoutube url={selectedLesson.youtube} />
              </div>
            )}

            {selectedLesson.description && (
              <p className="mb-4 leading-relaxed">
                {selectedLesson.description}
              </p>
            )}

            {selectedLesson.homework && (
              <div className="mt-4">
                <h4 className="font-semibold text-pink-500 mb-1">
                  📝 {i18n.language === "ru" ? "Домашнее задание" : "Домашнє завдання"}
                </h4>
                <p>{selectedLesson.homework}</p>
              </div>
            )}

            {selectedLesson.materials && (
              <div className="mt-4">
                <h4 className="font-semibold text-pink-500 mb-1">
                  📚 {i18n.language === "ru" ? "Материалы" : "Матеріали"}
                </h4>
                <p>{selectedLesson.materials}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

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
  Moon,
  Globe,
  CheckSquare,
  FolderOpen,
} from "lucide-react";

const BACKEND = "https://anknails-backend-production.up.railway.app";

const SafeVideo = ({ lesson, t }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [lastSent, setLastSent] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!lesson) return;

    if (lesson.youtube_id?.includes("cloudinary.com")) {
      fetch(`${BACKEND}/api/sign_video/${lesson.id}`)
        .then((r) => r.json())
        .then((data) => setVideoUrl(data.url || null))
        .catch(() => setVideoUrl(null))
        .finally(() => setLoading(false));
    } else if (lesson.embed_url) {
      setVideoUrl(lesson.embed_url);
      setLoading(false);
    } else {
      setVideoUrl(null);
      setLoading(false);
    }

    const email = localStorage.getItem("user_email");
    if (email) {
      fetch(`${BACKEND}/api/users`)
        .then((r) => r.json())
        .then((d) => {
          const u = d.users?.find((x) => x.email === email);
          if (u) setUserId(u.id);
        });
    }
  }, [lesson]);

  const sendProgress = async (watched, total, done = false) => {
    if (!userId || !lesson?.id || total <= 0) return;
    try {
      await fetch(`${BACKEND}/api/progress/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          lesson_id: lesson.id,
          watched_seconds: watched,
          total_seconds: total,
          completed: done,
        }),
      });
    } catch (e) {
      console.warn("⚠️ Проблема з оновленням прогресу", e);
    }
  };

  if (loading)
    return (
      <div className="w-full aspect-video flex items-center justify-center bg-black/60 rounded-xl text-pink-300 text-sm">
        Завантаження відео...
      </div>
    );

  if (!videoUrl)
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        ❌{" "}
        {t(
          "Невірне посилання або відео не знайдено",
          "Неверная ссылка или видео не найдено"
        )}
      </p>
    );

  const isYouTube = videoUrl.includes("youtube");
  if (isYouTube) {
    return (
      <div className="w-full aspect-video flex items-center justify-center bg-black/70 text-pink-400 rounded-xl">
        {t(
          "YouTube не підтримує відстеження прогресу",
          "YouTube не поддерживает прогресс"
        )}
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden border border-pink-300 shadow-md bg-black">
      <video
        src={videoUrl}
        controls
        playsInline
        controlsList="nodownload"
        preload="metadata"
        className="w-full h-full object-cover"
        onTimeUpdate={(e) => {
          const current = e.target.currentTime;
          const total = e.target.duration;
          if (current - lastSent >= 10) {
            setLastSent(current);
            sendProgress(current, total);
          }
          if (!completed && current >= total * 0.95) {
            setCompleted(true);
            sendProgress(total, total, true);
          }
        }}
      >
        {t(
          "Ваш браузер не підтримує відтворення відео",
          "Ваш браузер не поддерживает воспроизведение видео"
        )}
      </video>
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
  const [banner, setBanner] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState({});

  const t = (ua, ru) => (i18n.language === "ru" ? ru : ua);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) i18n.changeLanguage(savedLang);
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    const expires = localStorage.getItem("expires_at");
    if (!email || !expires) {
      window.location.href = "/login";
      return;
    }
    const expiryDate = new Date(expires);
    if (expiryDate < new Date()) {
      localStorage.clear();
      alert(t("Термін дії акаунта минув", "Срок действия аккаунта истек"));
      window.location.href = "/login";
      return;
    }
    fetch(`${BACKEND}/api/users`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.users?.find((u) => u.email === email);
        if (!found) {
          window.location.href = "/login";
          return;
        }
        setUser({
          id: found.id,
          email,
          name: found.name || null,
          expires_at: new Date(found.expires_at).toLocaleDateString(),
          course_id: found.course_id || null,
        });
      })
      .catch(() => (window.location.href = "/login"));
  }, []);

  useEffect(() => {
    fetch(`${BACKEND}/api/banner`)
      .then((res) => res.json())
      .then((data) => setBanner(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user?.course_id) return;
    fetch(`${BACKEND}/api/modules/${user.course_id}`)
      .then((res) => res.json())
      .then((data) => setModules(data.modules || []))
      .catch(() => console.error("Помилка завантаження модулів"));
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${BACKEND}/api/progress/user/${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        const map = {};
        (data.progress || []).forEach((p) => {
          map[p.lesson_id] = p;
        });
        setProgress(map);
      })
      .catch(() => console.error("Помилка прогресу"));
  }, [user]);

  const fetchLessons = async (moduleId) => {
    try {
      const res = await fetch(`${BACKEND}/api/lessons/${moduleId}`);
      const data = await res.json();
      const normalized = (data.lessons || []).map((l) => ({
        ...l,
        videoUrl: l.youtube_id || l.embed_url || null,
      }));
      setLessons((prev) => ({ ...prev, [moduleId]: normalized }));
    } catch (e) {
      console.error(e);
    }
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

      <aside
        className={`w-72 flex flex-col fixed md:static top-0 h-screen transition-transform duration-300 z-10 border-r backdrop-blur-xl ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${
          darkMode
            ? "border-fuchsia-900/30 bg-[#1a0a1f]/80"
            : "border-pink-200 bg-white/80"
        } md:pt-0 pt-16`}
      >
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex flex-col items-center text-center mb-6">
            <User className="w-16 h-16 text-pink-500 mb-2" />
            <h2 className="font-bold text-lg">
              {user.name || user.email.split("@")[0]}
            </h2>
            <p className="text-sm opacity-70">
              {t("Доступ до", "Доступ до")}: {user.expires_at}
            </p>
          </div>

          {modules.length === 0 ? (
            <p className="text-center text-sm opacity-70">
              {t("Модулів ще немає або курс не призначено", "Модулей нет или курс не назначен")}
            </p>
          ) : (
            <div className="space-y-2">
              {modules.map((mod) => (
                <div key={mod.id}>
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="w-full flex justify-between items-center px-3 py-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition font-semibold text-pink-600 relative"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> {mod.title}
                    </span>
                    <span className="absolute right-10 text-xs bg-pink-500 text-white rounded-full px-2 py-[1px]">
                      {mod.lessons || 0}
                    </span>
                    {expanded === mod.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {expanded === mod.id && (
                    <div className="ml-6 mt-2 space-y-2 border-l border-pink-200/30 pl-3">
                      {lessons[mod.id]?.map((l) => {
                        const prog = progress[l.id];
                        const percent =
                          prog && prog.total_seconds > 0
                            ? Math.min(100, Math.round((prog.watched_seconds / prog.total_seconds) * 100))
                            : 0;
                        const done = prog?.completed || prog?.homework_done;

                        return (
                          <div
                            key={l.id}
                            onClick={() => {
                              setSelectedLesson(l);
                              setMenuOpen(false);
                            }}
                            className={`relative text-sm px-3 py-2 rounded-lg cursor-pointer border transition-all ${
                              selectedLesson?.id === l.id
                                ? "border-pink-400 bg-pink-50 dark:bg-fuchsia-950/40 text-pink-600"
                                : "border-transparent hover:bg-pink-100/40 dark:hover:bg-fuchsia-900/30"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {done ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M9 12l2 2 4-4" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10" />
                                </svg>
                              )}

                              <span className="flex-1 truncate">{l.title}</span>

                              {percent > 0 && (
                                <span className={`text-[11px] ml-1 font-semibold ${done ? "text-green-500" : "text-pink-500"}`}>
                                  {percent}%
                                </span>
                              )}
                            </div>

                            <div className="mt-1 h-1.5 bg-pink-100 dark:bg-fuchsia-950/50 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  done
                                    ? "bg-green-400"
                                    : percent > 0
                                    ? "bg-gradient-to-r from-pink-400 to-rose-500"
                                    : "bg-transparent"
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Низ меню */}
        <div className="p-6 border-t border-pink-200/30 space-y-6 mt-auto">
          {/* Темна тема */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-pink-500" />
              <span>{t("Темна тема", "Тёмная тема")}</span>
            </div>
            <button
              onClick={() => {
                const newMode = !darkMode;
                setDarkMode(newMode);
                document.documentElement.classList.toggle("dark", newMode);
                localStorage.setItem("theme", newMode ? "dark" : "light");
              }}
              className={`relative w-12 h-6 rounded-full transition-all duration-500 ease-out ${
                darkMode
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                  : "bg-pink-200"
              }`}
            >
              <span
                className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-500 ease-out ${
                  darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              ></span>
            </button>
          </div>

          {/* Мова */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-pink-500" />
              <span>{t("Язык", "Мова")}</span>
            </div>
            <div className="flex gap-2">
              {["ru", "uk"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    i18n.changeLanguage(lang);
                    localStorage.setItem("lang", lang);
                  }}
                  className={`px-3 py-1 rounded-lg font-medium border text-xs transition-all duration-300 ${
                    i18n.language === lang
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white text-pink-600 border-pink-300 hover:bg-pink-100"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Вихід */}
          <button
            onClick={handleLogout}
            className="w-full py-2 mt-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-[1.03] transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> {t("Вийти", "Выйти")}
          </button>
        </div>
      </aside>

      {/* Контент */}
      <main className="flex-1 p-5 md:p-10 mt-16 md:mt-0 overflow-y-auto">
        {banner && banner.active && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-[0_0_25px_rgba(255,0,128,0.25)]">
            {banner.image_url && <img src={banner.image_url} alt="Banner" className="w-full h-48 md:h-64 object-cover" />}
            <div className="p-4 text-center bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-base md:text-lg">
              {banner.title}
            </div>
          </div>
        )}

        {!selectedLesson ? (
          <div className="flex items-center justify-center h-full text-center opacity-70">
            <p className="text-lg">{t("Оберіть урок у меню зліва", "Выберите урок в меню слева")}</p>
          </div>
        ) : (
          <div
            className={`max-w-4xl mx-auto p-6 rounded-2xl shadow-lg ${
              darkMode ? "bg-[#1a0a1f]/70 border border-fuchsia-900/40" : "bg-white/80 border border-pink-200"
            }`}
          >
            <h2 className="text-2xl font-bold text-pink-600 mb-4">{selectedLesson.title}</h2>
            <SafeVideo lesson={selectedLesson} t={t} />

            {selectedLesson.description && (
              <div className="mt-4">
                <h4 className="font-semibold mb-1">{t("Опис", "Описание")}</h4>
                <p>{selectedLesson.description}</p>
              </div>
            )}

            {selectedLesson.homework && (
              <div className="mt-5 flex flex-col gap-1">
                <h4 className="flex items-center gap-2 font-semibold text-pink-500 mb-1">
                  <CheckSquare className="w-5 h-5 text-pink-500" />
                  {t("Домашнє завдання", "Домашнее задание")}
                </h4>
                <p className="pl-7">{selectedLesson.homework}</p>

                {progress[selectedLesson.id]?.homework_done && (
                  <div className="mt-3 ml-6 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 w-fit">
                    ✅ {t("Домашнє завдання виконано", "Домашнее задание выполнено")}
                  </div>
                )}
              </div>
            )}

            {selectedLesson.materials && (
              <div className="mt-5 flex flex-col gap-1">
                <h4 className="flex items-center gap-2 font-semibold text-pink-500 mb-1">
                  <FolderOpen className="w-5 h-5 text-pink-500" />
                  {t("Матеріали", "Материалы")}
                </h4>
                {selectedLesson.materials.startsWith("http") ? (
                  <a
                    href={selectedLesson.materials}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pl-7 text-pink-600 underline hover:text-pink-700 transition"
                  >
                    {t("Відкрити матеріал", "Открыть материал")}
                  </a>
                ) : (
                  <p className="pl-7">{selectedLesson.materials}</p>
                )}
              </div>
            )}
          </div>
        )}

        <footer
          className={`mt-10 text-center py-6 text-sm border-t ${
            darkMode ? "border-fuchsia-900/30 text-fuchsia-100/80" : "border-pink-200 text-gray-600"
          }`}
        >
          <p className="font-medium">
            © {new Date().getFullYear()} <span className="text-pink-500 font-semibold">ANK Studio LMS</span> •{" "}
            {t("Усі права захищені.", "Все права защищены.")}
          </p>
        </footer>
      </main>
    </div>
  );
}

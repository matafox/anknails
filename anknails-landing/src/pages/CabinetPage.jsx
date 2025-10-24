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
  Moon,
  Globe,
  CheckSquare,
  FolderOpen,
} from "lucide-react";

// 🎥 Безпечний плеєр (YouTube або Cloudinary)
const SafeVideo = ({ url, videoId, t }) => {
  if (!url && !videoId)
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        ❌ {t("Невірне посилання або відео не знайдено", "Неверная ссылка или видео не найдено")}
      </p>
    );

  // 🎬 Якщо це Cloudinary або інше пряме посилання
  if (url && url.includes("cloudinary.com")) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden border border-pink-300 shadow-md">
        <video
          src={url}
          controls
          controlsList="nodownload"
          preload="metadata"
          className="w-full h-full object-cover"
        >
          {t("Ваш браузер не підтримує відтворення відео", "Ваш браузер не поддерживает воспроизведение видео")}
        </video>
      </div>
    );
  }

  // 🎞️ Якщо це YouTube
  let id = videoId || null;
  if (!id && url) {
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    id = match ? match[1] : null;
  }

  if (!id)
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        ❌ {t("Невірне посилання або відео не знайдено", "Неверная ссылка или видео не найдено")}
      </p>
    );

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden border border-pink-300 shadow-md">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?controls=1&modestbranding=1&rel=0&showinfo=0`}
        allow="autoplay; fullscreen; picture-in-picture"
        loading="lazy"
        className="w-full h-full"
      />
    </div>
  );
};

export default function CabinetPage() {
  const { i18n } = useTranslation();
  const BACKEND = "https://anknails-backend-production.up.railway.app";

  const [user, setUser] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [banner, setBanner] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const t = (ua, ru) => (i18n.language === "ru" ? ru : ua);

  // 🌓 Тема
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // 🌍 Мова
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  // 🧠 Авторизація
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

  // 🎀 Банер
  useEffect(() => {
    fetch(`${BACKEND}/api/banner`)
      .then((res) => res.json())
      .then((data) => setBanner(data))
      .catch(() => {});
  }, []);

  // 📘 Модулі користувача
  useEffect(() => {
    if (!user?.course_id) return;
    fetch(`${BACKEND}/api/modules/${user.course_id}`)
      .then((res) => res.json())
      .then((data) => setModules(data.modules || []))
      .catch(() => console.error("Помилка завантаження модулів"));
  }, [user]);

  const fetchLessons = async (moduleId) => {
    try {
      const res = await fetch(`${BACKEND}/api/lessons/${moduleId}`);
      const data = await res.json();
      const normalized = (data.lessons || []).map((l) => {
        const id =
          l.youtube_id && l.youtube_id.includes("cloudinary.com")
            ? null
            : l.youtube_id?.match(/([a-zA-Z0-9_-]{11})/)?.[1] || null;
        return {
          ...l,
          videoId: id,
          videoUrl: l.youtube_id || l.embed_url || null,
        };
      });
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
      {/* ☰ меню / контент залишено без змін */}

      <main className="flex-1 p-5 md:p-10 mt-16 md:mt-0 overflow-y-auto">
        {banner && banner.active && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-[0_0_25px_rgba(255,0,128,0.25)]">
            {banner.image_url && (
              <img src={banner.image_url} alt="Banner" className="w-full h-48 md:h-64 object-cover" />
            )}
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
              darkMode
                ? "bg-[#1a0a1f]/70 border border-fuchsia-900/40"
                : "bg-white/80 border border-pink-200"
            }`}
          >
            <h2 className="text-2xl font-bold text-pink-600 mb-4">{selectedLesson.title}</h2>

            {/* 🎥 автоматичне визначення типу відео */}
            <SafeVideo url={selectedLesson.videoUrl} videoId={selectedLesson.videoId} t={t} />

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

        {/* 💖 Футер */}
        <footer
          className={`mt-10 text-center py-6 text-sm border-t ${
            darkMode
              ? "border-fuchsia-900/30 text-fuchsia-100/80"
              : "border-pink-200 text-gray-600"
          }`}
        >
          <p className="font-medium">
            © {new Date().getFullYear()}{" "}
            <span className="text-pink-500 font-semibold">ANK Studio LMS</span> •{" "}
            {t("Усі права захищені.", "Все права защищены.")}
          </p>
        </footer>
      </main>
    </div>
  );
}

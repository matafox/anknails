import { useEffect, useMemo, useRef, useState } from "react";
import WelcomeModal from "./WelcomeModal";
import DashboardSection from "./DashboardSection";
import ModulesPage from "./ModulesPage";
import { useTranslation } from "react-i18next";
import {
  LogOut,
  SquareUserRound,
  Menu,
  ArrowRightCircle,
  X,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Moon,
  Globe,
  Flame,
  Check,
  HelpCircle, 
  Home,
} from "lucide-react";

const BACKEND = "https://anknails-backend-production.up.railway.app";

/* ================= SAFEVIDEO (BUNNY + дебаг + “живучий” парсер) ================= */
const SafeVideo = ({ lesson, t, getNextLesson, userId, onProgressTick, onCompleted }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const isBunnyGuid = (s) =>
    typeof s === "string" &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s);

  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const iframeRef = useRef(null);
  const pollTimerRef = useRef(null);
  const saveTimerRef = useRef(null);
  const askKickTimerRef = useRef(null);

  // для “кожні 10с”
  const lastBucketRef = useRef(-1);

  const postProgress = useMemo(
    () => async (payload) => {
      try {
        console.debug("[SV] POST /progress/update", payload);
        const r = await fetch(`${BACKEND}/api/progress/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.debug("[SV] /progress/update →", r.status);
        return r.ok;
      } catch (e) {
        console.warn("[SV] progress update error", e);
        return false;
      }
    },
    []
  );

  // коли вперше з’явився duration — насіваємо прогрес тільки якщо є хоч трохи перегляду
  const seededRef = useRef(false);
  useEffect(() => {
    if (!userId || !lesson?.id || !duration || seededRef.current) return;
    if ((current || 0) <= 0) return;

    seededRef.current = true;

    onProgressTick?.({
      lessonId: lesson.id,
      watched_seconds: Math.floor(Math.min(current || 0, duration)),
      total_seconds: Math.floor(duration),
      completed: false,
    });

    (async () => {
      await postProgress({
        user_id: userId,
        lesson_id: lesson.id,
        watched_seconds: Math.floor(Math.min(current || 0, duration)),
        total_seconds: Math.floor(duration),
        completed: false,
      });
    })();
  }, [userId, lesson?.id, duration, current, onProgressTick, postProgress]);

  // fallback тривалості з бекенду
  useEffect(() => {
    if (!lesson?.youtube_id) return;

    const t = setTimeout(async () => {
      if (duration > 0) return;
      try {
        const r = await fetch(`${BACKEND}/api/bunny/meta/${lesson.youtube_id}`);
        if (!r.ok) return;
        const j = await r.json();
        const len = Number(j?.length || 0);
        if (len > 0) {
          console.debug("[SV] fallback meta length:", len);
          setDuration(len);
        }
      } catch (e) {
        console.debug("[SV] meta fallback failed", e);
      }
    }, 2000);

    return () => clearTimeout(t);
  }, [lesson?.youtube_id, duration]);

  useEffect(() => {
    console.debug("[SV] mount for lesson", lesson?.id, lesson?.title);
    setDuration(0);
    setCurrent(0);
    setShowNext(false);
    lastBucketRef.current = -1;
    seededRef.current = false;
  }, [lesson?.id]);

  /// підписаний iframe URL
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!lesson || !isBunnyGuid(lesson.youtube_id)) {
        console.debug("[SV] lesson missing or not Bunny GUID:", lesson?.youtube_id);
        setVideoUrl(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(`${BACKEND}/api/bunny/embed/${lesson.youtube_id}`);
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          console.warn("[SV] embed fetch !ok", res.status, txt);
          if (!cancelled) setVideoUrl(null);
          return;
        }

        const j = await res.json().catch(() => ({}));
        let url = j.url || null;

        if (url) {
          try {
            const u = new URL(url);
            u.searchParams.set("autoplay", "true");
            u.searchParams.set("muted", "true");
            u.searchParams.set("controls", "true");
            u.searchParams.set("playerId", "ank");
            u.searchParams.set("transparent", "false");
            url = u.toString();
          } catch (e) {
            console.warn("[SV] URL normalize failed, fallback to raw", e);
          }
        }

        console.debug("[SV] got embed url:", url);
        if (!cancelled) setVideoUrl(url);
      } catch (e) {
        console.warn("[SV] embed fetch failed", e);
        if (!cancelled) setVideoUrl(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lesson?.youtube_id]);

  // слухач подій Bunny
  useEffect(() => {
    if (!videoUrl) return;

    const ORIGIN_OK = (origin) => /mediadelivery\.net/i.test(origin) || /bunnycdn/i.test(origin);

    const handler = (e) => {
      try {
        if (!ORIGIN_OK(String(e.origin))) {
          console.debug("[SV] postMessage (ignored origin)", e.origin, e.data);
          return;
        }
        const data = e.data ?? {};
        const ev = data.event || data.type || data.action || "unknown";
        console.debug("[SV] postMessage", ev, data);

        const now =
          typeof data.currentTime === "number"
            ? data.currentTime
            : typeof data.time === "number"
            ? data.time
            : typeof data.value === "number" && (ev === "timeupdate" || ev === "currentTime")
            ? data.value
            : null;

        if (typeof now === "number" && !Number.isNaN(now)) {
          setCurrent(now);
        }

        const dur =
          typeof data.duration === "number" && data.duration > 0
            ? data.duration
            : typeof data.value === "number" && (ev === "durationchange" || ev === "duration") && data.value > 0
            ? data.value
            : null;

        if (typeof dur === "number" && dur > 0) setDuration(dur);

        if (ev === "ended" || data.ended === true) {
          console.debug("[SV] ended event");
          setShowNext(true);
          setCurrent((c) => (duration ? duration : c));
          try {
            onCompleted?.();
          } catch {}
        }
      } catch (err) {
        console.warn("[SV] handler error", err);
      }
    };

    window.addEventListener("message", handler);

    const ask = () => {
      try {
        const w = iframeRef.current?.contentWindow;
        w?.postMessage({ command: "getCurrentTime" }, "*");
        w?.postMessage({ command: "getDuration" }, "*");
        w?.postMessage("getCurrentTime", "*");
        w?.postMessage("getDuration", "*");
      } catch (e) {}
    };
    ask();
    pollTimerRef.current = window.setInterval(ask, 800);

    askKickTimerRef.current = window.setTimeout(() => {
      if (!duration) {
        console.debug("[SV] duration still 0 → extra ask()");
        ask();
      }
    }, 2000);

    return () => {
      window.removeEventListener("message", handler);
      if (pollTimerRef.current) window.clearInterval(pollTimerRef.current);
      if (askKickTimerRef.current) window.clearTimeout(askKickTimerRef.current);
    };
  }, [videoUrl, duration, onCompleted]);

  // локальні тики кожні ~10с — ❗ лише коли знаємо тривалість і є перегляд
  useEffect(() => {
    const total = duration || 0;
    const watched = total ? Math.min(current, total) : current;

    if (total <= 0 || watched <= 0) return;

    const bucket = Math.floor((watched || 0) / 10);
    if (bucket !== lastBucketRef.current) {
      lastBucketRef.current = bucket;
      onProgressTick?.({
        lessonId: lesson?.id,
        watched_seconds: Math.floor(watched || 0),
        total_seconds: Math.floor(total),
        completed: total > 0 && watched >= total - 2,
      });
    }

    if (total > 0) {
      const remaining = Math.max(0, total - watched);
      if (remaining <= 10) setShowNext(true);
    }
  }, [current, duration, lesson?.id, onProgressTick]);

  // періодичний пуш у бекенд
  useEffect(() => {
    if (!userId || !lesson?.id) return;

    const save = async () => {
      if (!duration || current <= 0) return;
      await postProgress({
        user_id: userId,
        lesson_id: lesson.id,
        watched_seconds: Math.floor(Math.min(current, duration)),
        total_seconds: Math.floor(duration),
        completed: duration > 0 && duration - current <= 2,
      });
    };

    saveTimerRef.current = window.setInterval(save, 5000);
    return () => {
      if (saveTimerRef.current) window.clearInterval(saveTimerRef.current);
      save();
    };
  }, [userId, lesson?.id, current, duration, postProgress]);

  if (loading) {
    return (
      <div className="w-full aspect-video flex items-center justify-center bg-black/60 rounded-xl text-pink-300 text-sm">
        {t("Завантаження відео...", "Загрузка видео...")}
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">
          ❌ {t("Відео не знайдено або посилання некоректне", "Видео не найдено или ссылка некорректна")}
        </p>
        {userId && lesson?.id && (
          <button
            onClick={async () => {
              await postProgress({
                user_id: userId,
                lesson_id: lesson.id,
                watched_seconds: 999,
                total_seconds: 1000,
                completed: true,
              });
              try { onCompleted?.(); } catch {}
              alert("Debug: прогрес відправлено як завершений.");
            }}
            className="mt-3 px-4 py-2 rounded-lg bg-pink-500 text-white text-sm"
          >
            ⚡ Mark complete (debug)
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full aspect-video rounded-xl overflow-hidden border border-pink-300 shadow-md bg-black relative">
        <iframe
          ref={iframeRef}
          src={videoUrl}
          className="w-full h-full rounded-xl"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write"
          allowFullScreen
          referrerPolicy="origin"
          onLoad={() => {
            console.debug("[SV] iframe onLoad");
            try {
              const w = iframeRef.current?.contentWindow;
              w?.postMessage({ command: "getDuration" }, "*");
              w?.postMessage({ command: "getCurrentTime" }, "*");
              w?.postMessage("getDuration", "*");
              w?.postMessage("getCurrentTime", "*");
            } catch {}
          }}
        />
      </div>

      {getNextLesson && showNext && (
        <button
          onClick={async () => {
            const n = getNextLesson(lesson?.id);
            if (!n) return;

            await postProgress({
              user_id: userId,
              lesson_id: lesson.id,
              watched_seconds: Math.floor(Math.min(current, duration || current)),
              total_seconds: Math.floor(duration || 0),
              completed: true,
            });

            try { onCompleted?.(); } catch {}

            localStorage.setItem("last_lesson", JSON.stringify(n));
            localStorage.setItem("last_view", "lesson");
            window.location.reload();
          }}
          className="animate-fadeIn flex items-center gap-2 px-5 py-3 text-sm md:text-base font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-[1.03] transition-all shadow-md"
        >
          <ArrowRightCircle className="w-5 h-5" />
          {t("Перейти до наступного уроку", "Перейти к следующему уроку")}
        </button>
      )}
    </div>
  );
};

/* ================= CABINET PAGE ================= */
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

const [showWelcome, setShowWelcome] = useState(false);
const WELCOME_VER = 2;
const welcomeKeyFor = (uid) => `welcome_seen_v${WELCOME_VER}_${uid}`;

  useEffect(() => {
  if (!user?.id) return;

  const key = welcomeKeyFor(user.id);
  const seenLocal = localStorage.getItem(key) === "1";
  const seenSession = sessionStorage.getItem(key) === "1";

  // Якщо вже бачили — не показуємо
  if (seenLocal || seenSession) return;

  // Показуємо один раз у поточній сесії навіть без кліку користувача
  sessionStorage.setItem(key, "1");
  setShowWelcome(true);
}, [user?.id]);

// ⬇️ ДОДАЙ універсальний маркер «побачено»
const markWelcomeSeen = () => {
  if (!user?.id) { setShowWelcome(false); return; }
  const key = welcomeKeyFor(user.id);
  localStorage.setItem(key, "1");   // назавжди для цього користувача/версії
  sessionStorage.setItem(key, "1"); // на поточну вкладку
  setShowWelcome(false);
};
  
  const IMGUR_CLIENT_ID = "8f3cb6e4c248b26"; // як у BannerTab

  async function uploadToImgur(file) {
    const form = new FormData();
    form.append("image", file);
    const res = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: { Authorization: `Client-ID ${IMGUR_CLIENT_ID}` },
      body: form,
    });
    const j = await res.json();
    if (!res.ok || !j?.data?.link) throw new Error(j?.data?.error || "Imgur upload failed");
    return j.data.link;
  }

  const refreshAfterLessonComplete = async () => {
    if (!user?.id) return;

    try {
      const resCourse = await fetch(`${BACKEND}/api/progress/course/${user.id}`);
      const dataCourse = await resCourse.json();
      setOverallProgress(dataCourse.percent ?? 0);

      const resUser = await fetch(`${BACKEND}/api/progress/user/${user.id}`);
      const dataUser = await resUser.json();

      const map = {};
      (dataUser.progress || []).forEach((p) => (map[p.lesson_id] = p));
      setProgress(map);

      setUser((prev) =>
        prev
          ? { ...prev, xp: dataUser.xp ?? prev.xp, level: dataUser.level ?? prev.level }
          : prev
      );
    } catch (e) {
      console.warn("⚠️ refreshAfterLessonComplete failed", e);
    }
  };

  const avatarInputRef = useRef(null);

  const handleChooseAvatar = () => {
    avatarInputRef.current?.click();
  };

  const onAvatarSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const link = await uploadToImgur(file);

      const sessionToken = localStorage.getItem("session_token");
      const r = await fetch(`${BACKEND}/api/users/avatar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          session_token: sessionToken,
          avatar_url: link,
        }),
      });
      if (!r.ok) {
        const txt = await r.text().catch(() => "");
        throw new Error(`save avatar failed: ${r.status} ${txt}`);
      }
      const j = await r.json();

      setUser((prev) => (prev ? { ...prev, avatar_url: j.avatar_url } : prev));
    } catch (err) {
      alert(t("Не вдалося оновити аватар", "Не удалось обновить аватар"));
      console.warn(err);
    } finally {
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const [progress, setProgress] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);

  const [view, setView] = useState("dashboard");
  const t = (ua, ru) => (i18n.language === "ru" ? ru : ua);

  // last view / last lesson
  useEffect(() => {
    const lastView = localStorage.getItem("last_view");
    const savedLesson = localStorage.getItem("last_lesson");
    if (lastView === "lesson" && savedLesson) {
      try { setSelectedLesson(JSON.parse(savedLesson)); } catch { setSelectedLesson(null); }
    } else setSelectedLesson(null);
  }, []);

  // theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // lang
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) i18n.changeLanguage(savedLang);
  }, []);

  // auth + user
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
          xp: found.xp || 0,
          level: found.level || 1,
          package: found.package || "solo",
          avatar_url: found.avatar_url || null,
        });
      })
      .catch(() => (window.location.href = "/login"));
  }, []);

  // single-device session
  useEffect(() => {
    const email = localStorage.getItem("user_email");
    const token = localStorage.getItem("session_token");
    if (!email || !token) return;
    fetch(`${BACKEND}/api/check-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.valid) {
          alert(i18n.language === "ru" ? "Ваш аккаунт открыт в другом браузере." : "Ваш акаунт відкрито в іншому браузері.");
          localStorage.clear();
          window.location.href = "/login";
        }
      })
      .catch(() => {});
  }, [i18n.language]);

  // banner
  useEffect(() => {
    fetch(`${BACKEND}/api/banner`)
      .then((res) => res.json())
      .then((data) => setBanner(data))
      .catch(() => {});
  }, []);

  // modules + префетч уроків
  useEffect(() => {
    if (!user?.course_id) return;
    fetch(`${BACKEND}/api/modules/${user.course_id}?user_id=${user.id}`)
      .then((res) => res.json())
      .then(async (data) => {
        const mods = data.modules || [];
        setModules(mods);
        await Promise.all(
          mods.map(async (m) => {
            try {
              const r = await fetch(`${BACKEND}/api/lessons/${m.id}`);
              const j = await r.json();
              setLessons((prev) => ({ ...prev, [m.id]: (j.lessons || []).map((l) => ({ ...l })) }));
            } catch {}
          })
        );
      })
      .catch(() => console.error("Помилка завантаження модулів"));
  }, [user]);

  // початкове зчитування прогресу користувача + загальний прогрес
  useEffect(() => {
    if (!user?.id) return;

    fetch(`${BACKEND}/api/progress/user/${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        const map = {};
        (data.progress || []).forEach((p) => (map[p.lesson_id] = p));
        setProgress(map);
      })
      .catch(() => {});

    fetch(`${BACKEND}/api/progress/course/${user.id}`)
      .then((r) => r.json())
      .then((data) => setOverallProgress(data.percent ?? 0))
      .catch(() => setOverallProgress(0));
  }, [user]);

  // локальне оновлення від SafeVideo
  const handleProgressTick = ({ lessonId, watched_seconds, total_seconds, completed }) => {
    if (!lessonId) return;
    if ((total_seconds || 0) <= 0 || (watched_seconds || 0) <= 0) return;
    setProgress((prev) => ({
      ...prev,
      [lessonId]: {
        ...(prev[lessonId] || {}),
        watched_seconds,
        total_seconds,
        completed: completed || prev[lessonId]?.completed || false,
      },
    }));
  };

  const fetchLessons = async (moduleId) => {
    try {
      const res = await fetch(`${BACKEND}/api/lessons/${moduleId}`);
      const data = await res.json();
      const normalized = (data.lessons || []).map((l) => ({ ...l }));
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

  const progSelected = selectedLesson ? (progress[selectedLesson.id] || {}) : {};

  const toggleHomeworkDone = async (done) => {
    if (!user?.id || !selectedLesson?.id) return;
    try {
      const r = await fetch(`${BACKEND}/api/progress/homework`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          lesson_id: selectedLesson.id,
          homework_done: !!done,
        }),
      });

      if (!r.ok) throw new Error("bad status " + r.status);

      setProgress((prev) => ({
        ...prev,
        [selectedLesson.id]: {
          ...(prev[selectedLesson.id] || {}),
          homework_done: !!done,
        },
      }));

      await refreshAfterLessonComplete();
    } catch (e) {
      console.warn("toggleHomeworkDone failed", e);
      alert(t("Не вдалося оновити статус домашнього завдання", "Не удалось обновить статус домашнего задания"));
    }
  };

  // ✅ Ручне завершення уроку (фікс: ставимо безумовно 100%)
  const markLessonComplete = async () => {
    if (!user?.id || !selectedLesson?.id) return;

    const total = progSelected.total_seconds ?? 0;
    const watched = progSelected.watched_seconds ?? 0;
    const safeTotal = total > 0 ? total : watched > 0 ? watched : 1;

    try {
      await fetch(`${BACKEND}/api/progress/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          lesson_id: selectedLesson.id,
          completed: true,
          watched_seconds: safeTotal,
          total_seconds: safeTotal,
          homework_done: progSelected.homework_done ?? false,
        }),
      });

      setProgress((prev) => ({
        ...prev,
        [selectedLesson.id]: {
          ...(prev[selectedLesson.id] || {}),
          completed: true,
          watched_seconds: safeTotal,
          total_seconds: safeTotal,
        },
      }));

      await refreshAfterLessonComplete();
    } catch (e) {
      console.warn("markLessonComplete failed", e);
      alert(t("Не вдалося позначити урок завершеним", "Не удалось отметить урок завершенным"));
    }
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

      {showWelcome && (
  <WelcomeModal
    open={showWelcome}
    onClose={markWelcomeSeen}            
    onStart={() => {                     
      markWelcomeSeen();
      setView("modules");
    }}
    t={t}
    darkMode={darkMode}
    user={user}
  />
)}
      
      {/* HEADER */}
      <header
        className={`md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-5 py-4 border-b backdrop-blur-xl z-30 rounded-b-[6px] ${
          darkMode ? "border-fuchsia-900/30 bg-[#1a0a1f]/80" : "border-pink-200 bg-white/70"
        }`}
      >
        <h1 className="font-bold bg-gradient-to-r from-fuchsia-500 to-rose-400 bg-clip-text text-transparent">
          ANK Studio
        </h1>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* 🔲 Оверлей під сайдбаром (мобайл) */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-20 bg-black/40"
          onClick={() => setMenuOpen(false)}
        />
      )}

{/* SIDEBAR — мобілка: випадає згори; десктоп: ліворуч як завжди */}
<aside
  className={`
    fixed md:static inset-x-0 top-0
    w-full md:w-72
    h-[85vh] md:h-screen
    md:h-auto
    transition-transform duration-300
    z-30 md:z-auto
    border-b md:border-b-0 md:border-r
    backdrop-blur-xl
    ${menuOpen ? "translate-y-0" : "-translate-y-full md:translate-y-0"}
    ${darkMode ? "border-fuchsia-900/30 bg-[#1a0a1f]/80" : "border-pink-200 bg-white/80"}
    pt-16 md:pt-0
  `}
>
  {/* Кнопка закриття в самому меню (моб) */}
  <button
    onClick={() => setMenuOpen(false)}
    className="md:hidden absolute top-4 right-4 p-2 rounded-full bg-white/70 text-pink-600 shadow"
    aria-label="Close menu"
  >
    <X className="w-5 h-5" />
  </button>

  {/* ЄДИНА коренева обгортка всередині aside */}
  <div className="flex flex-col h-full">
    {/* Верхня прокручувана частина */}
    <div className="p-6 flex-1 overflow-y-auto">
      <div className="flex flex-col items-center text-center mb-4">
        {/* Прихований інпут для вибору файлу */}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onAvatarSelected}
        />

        {/* Кругла аватарка (клік — завантажити нову в Imgur) */}
        <button
          onClick={handleChooseAvatar}
          title={t("Змінити аватар", "Сменить аватар")}
          className="relative group"
        >
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover ring-2 ring-pink-300 shadow-md group-hover:scale-105 transition"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ring-2 shadow-md group-hover:scale-105 transition ${
                darkMode ? "ring-fuchsia-800/50 bg-[#15001f]" : "ring-pink-300 bg-pink-50"
              }`}
            >
              <SquareUserRound className="w-10 h-10 text-pink-500" />
            </div>
          )}

          {/* бейдж "Змінити" при ховері */}
          <span
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-semibold opacity-0 group-hover:opacity-100 pointer-events-none ${
              darkMode ? "bg-fuchsia-700 text-white" : "bg-pink-500 text-white"
            }`}
          >
            {t("Змінити", "Сменить")}
          </span>
        </button>

        <h2 className="mt-3 font-bold text-lg">
          {user.name || user.email.split("@")[0]}
        </h2>

        {/* 🔖 ТАРИФ: [бейдж] */}
        <div className="mt-1 flex items-center gap-2">
          <span className={`text-xs font-medium ${darkMode ? "text-fuchsia-200/80" : "text-gray-600"}`}>
            {t("Тариф:", "Тариф:")}
          </span>

          {user.package === "pro" ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white shadow">
              PRO
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium rounded-full border border-pink-300 text-pink-600 bg-white/70">
              {t("Самостійний", "Самостоятельный")}
            </span>
          )}
        </div>

        <p className="text-sm opacity-70">
          {t("Доступ до", "Доступ до")}: {user.expires_at}
        </p>
      </div>

      {/* Загальний прогрес курсу */}
      <div className="mb-4 px-3">
        <p className="text-xs text-center font-medium text-pink-600">
          {t("Прогрес курсу", "Прогресс курса")}: {overallProgress}%
        </p>
        <div className="mt-1 h-2 bg-pink-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-700 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* MODULES */}
      {modules.length === 0 ? (
        <p className="text-center text-sm opacity-70">
          {t("Модулів ще немає або курс не призначено", "Модулей нет или курс не назначен")}
        </p>
      ) : (
        <div className="space-y-2">
          {modules.map((mod) => (
            <div key={mod.id} className="mb-2">
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex justify-between items-center px-3 py-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition font-semibold text-pink-600 relative"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> {mod.title}
                </span>
                <span className="absolute right-10 text-xs bg-pink-500 text-white rounded-full px-2 py-[1px]">
                  {typeof mod.lessons === "number" ? mod.lessons : (lessons[mod.id]?.length ?? 0)}
                </span>
                {expanded === mod.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {mod.description && (
                <p className={`text-xs mt-1 ml-8 pr-4 leading-snug ${darkMode ? "text-fuchsia-200/70" : "text-gray-600"}`}>
                  {mod.description}
                </p>
              )}

              {expanded === mod.id && (
                <div className="ml-6 mt-2 space-y-2 border-l border-pink-200/30 pl-3">
                  {lessons[mod.id]?.map((l) => {
                    const prog = progress[l.id];
                    const done = !!prog?.completed;
                    const percent = done
                      ? 100
                      : (prog && prog.total_seconds > 0
                          ? Math.min(100, Math.max(0, Math.round((prog.watched_seconds / prog.total_seconds) * 100)))
                          : 0);
                    const isNew = new Date(l.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

                    return (
                      <div
                        key={l.id}
                        onClick={() => {
                          setSelectedLesson(l);
                          localStorage.setItem("last_lesson", JSON.stringify(l));
                          localStorage.setItem("last_view", "lesson");
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
                          {isNew && <Flame className="w-4 h-4 text-pink-500 ml-1 animate-pulse" />}
                          {percent > 0 && (
                            <span className={`text-[11px] ml-1 font-semibold ${done ? "text-green-500" : "text-pink-500"}`}>
                              {percent}%
                            </span>
                          )}
                        </div>
                        <div className="mt-1 h-1.5 bg-pink-100 dark:bg-fuchsia-950/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${done ? "bg-green-400" : percent > 0 ? "bg-gradient-to-r from-pink-400 to-rose-500" : "bg-transparent"}`}
                            style={{ width: `${percent}%`, transition: "width 0.7s ease-out", willChange: "width" }}
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

{/* ПІДТРИМКА + ГОЛОВНА — по вертикалі, в два ряди (іконки й текст ліворуч) */}
<div className="mt-6 space-y-2">
  <a
    href="https://t.me/m/cE5yXCdSZTAy"
    className={`w-full flex items-center justify-start gap-2 px-3 py-2 rounded-lg border transition text-left ${
      darkMode
        ? "border-fuchsia-900/30 bg-[#1a0a1f]/60 hover:bg-[#1a0a1f]/80"
        : "border-pink-200 bg-white/70 hover:bg-white"
    }`}
    title={t("Звернутися у підтримку", "Обратиться в поддержку")}
  >
    <HelpCircle className="w-4 h-4 text-pink-600" />
    <span className="text-pink-600 font-medium">{t("Підтримка", "Поддержка")}</span>
  </a>

  <button
    onClick={() => {
      setSelectedLesson(null);
      setView("dashboard");
      localStorage.setItem("last_view", "dashboard");
      setMenuOpen(false);
      try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch {}
    }}
    className={`w-full flex items-center justify-start gap-2 px-3 py-2 rounded-lg border transition text-left ${
      darkMode
        ? "border-fuchsia-900/30 bg-[#1a0a1f]/60 hover:bg-[#1a0a1f]/80"
        : "border-pink-200 bg-white/70 hover:bg-white"
    }`}
    title={t("Перейти на головну", "Перейти на главную")}
  >
    <Home className="w-4 h-4 text-pink-600" />
    <span className="text-pink-600 font-medium">{t("Головна", "Главная")}</span>
  </button>
</div>
    </div>

    {/* Нижній футер сайдбару */}
    <div className="p-6 border-t border-pink-200/30 space-y-6">
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
            darkMode ? "bg-gradient-to-r from-pink-500 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]" : "bg-pink-200"
          }`}
        >
          <span
            className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-500 ease-out ${
              darkMode ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Мова */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-pink-500" />
          <span>{t("Мова", "Язык")}</span>
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
                i18n.language === lang ? "bg-pink-500 text-white border-pink-500" : "bg-white text-pink-600 border-pink-300 hover:bg-pink-100"
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
  </div>
</aside>

      {/* Контент */}
      <main className="flex-1 p-5 md:p-10 mt-16 md:mt-0 overflow-y-auto">
        {banner && banner.active && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* 🖼 Основний банер */}
            <div className="flex-1 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(255,0,128,0.25)]">
              {banner.image_url && <img src={banner.image_url} alt="Banner" className="w-full h-48 md:h-64 object-cover" />}
              <div className="p-4 text-center bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-base md:text-lg">
                {banner.title}
              </div>
            </div>

            {/* 💅 Перехід на дашборд */}
            <div
              onClick={() => {
                setSelectedLesson(null);
                setMenuOpen(false);
                localStorage.setItem("last_view", "dashboard");
              }}
              className="w-full md:w-1/3 cursor-pointer rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(255,0,128,0.25)] bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-extrabold text-xl md:text-2xl tracking-wide transition-transform hover:scale-[1.03] active:scale-[0.98]"
              title={t("Перейти до дашборду", "Перейти на главную")}
            >
              ANK Studio Online
            </div>
          </div>
        )}

        {!selectedLesson ? (
          <>
            {view === "dashboard" && (
              <DashboardSection
                key={user?.xp}
                modules={modules}
                lessons={lessons}
                progress={progress}
                overallProgress={overallProgress}
                darkMode={darkMode}
                t={t}
                user={user}
                onOpenModules={() => setView("modules")}
              />
            )}

            {view === "modules" && (
              <ModulesPage
                modules={modules}
                darkMode={darkMode}
                t={t}
                onBack={() => setView("dashboard")}
                onOpenLesson={(lesson) => {
                  setSelectedLesson(lesson);
                  setView("dashboard");
                }}
                progress={progress}
              />
            )}
          </>
        ) : (
          <div
            className={`max-w-4xl mx-auto p-6 rounded-2xl shadow-lg ${
              darkMode ? "bg-[#1a0a1f]/70 border border-fuchsia-900/40" : "bg-white/80 border border-pink-200"
            }`}
          >
            {/* Заголовок + тип */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-pink-600">{selectedLesson.title}</h2>
                  {selectedLesson.type === "theory" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border border-pink-200 bg-pink-50 text-pink-600">
                      {t("Теорія", "Теория")}
                    </span>
                  )}
                  {selectedLesson.type === "practice" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border border-rose-200 bg-rose-50 text-rose-600">
                      {t("Практика", "Практика")}
                    </span>
                  )}
                </div>
              </div>
              {selectedLesson.description && (
                <p className={`mt-2 text-sm leading-relaxed select-text ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {selectedLesson.description}
                </p>
              )}
            </div>

            {/* Відео + прогрес */}
            <SafeVideo
              lesson={selectedLesson}
              t={t}
              userId={user?.id}
              onProgressTick={handleProgressTick}
              onCompleted={refreshAfterLessonComplete}
              getNextLesson={(id) => {
                const allLessons = Object.values(lessons).flat();
                const idx = allLessons.findIndex((l) => l.id === id);
                return allLessons[idx + 1] || null;
              }}
            />

            {/* Ручне завершення уроку */}
            {!progSelected.completed && (
              <div className="mt-4">
                <button
                  onClick={markLessonComplete}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:scale-[1.02] transition"
                >
                  {t("Позначити урок пройденим", "Отметить урок пройденным")}
                </button>
              </div>
            )}

            {/* Домашка + Матеріали */}
            <div className="mt-6 space-y-4">
              {/* Домашка */}
              {selectedLesson.homework && (
                <div
                  className={`p-4 rounded-xl border relative ${
                    darkMode
                      ? "bg-fuchsia-950/40 border-fuchsia-800/40 text-gray-100"
                      : "bg-gray-50 border-gray-200 text-gray-800"
                  }`}
                >
                  {/* 🔖 Бейдж у правому верхньому куті */}
                  {!progSelected.homework_done ? (
                    <button
                      onClick={() => toggleHomeworkDone(true)}
                      className="absolute top-3 right-3 text-[11px] font-medium opacity-70 hover:opacity-100 underline-offset-2 hover:underline text-gray-500 dark:text-gray-300"
                      title={t("Позначити ДЗ виконаним", "Отметить ДЗ выполненным")}
                    >
                      {t("Виконано?", "Выполнено?")}
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleHomeworkDone(false)}
                      className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200"
                      title={t("Скасувати позначку ДЗ", "Снять отметку ДЗ")}
                    >
                      <Check className="w-3.5 h-3.5" />
                      {t("Виконано", "Выполнено")}
                    </button>
                  )}

                  <h3 className="font-semibold mb-2 text-pink-600 dark:text-fuchsia-300">
                    {t("Домашнє завдання", "Домашнее задание")}
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap select-text">
                    {selectedLesson.homework}
                  </p>
                </div>
              )}

              {/* Матеріали */}
              {selectedLesson.materials && (
                <div
                  className={`p-4 rounded-xl border ${
                    darkMode
                      ? "bg-fuchsia-950/40 border-fuchsia-800/40 text-gray-100"
                      : "bg-gray-50 border-gray-200 text-gray-800"
                  }`}
                >
                  <h3 className="font-semibold mb-2 text-gray-700 dark:text-green-200">
                    {t("Матеріали", "Материалы")}
                  </h3>
                  <a
                    href={selectedLesson.materials}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block text-sm font-medium underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded
                      ${darkMode ? "text-emerald-300 hover:text-emerald-200" : "text-emerald-600 hover:text-emerald-700"}`}
                  >
                    {t("Відкрити посилання", "Открыть ссылку")}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

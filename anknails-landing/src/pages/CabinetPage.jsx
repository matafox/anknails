import { useEffect, useMemo, useRef, useState } from "react";
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
  CheckSquare,
  Flame,
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

  // коли вперше з’явився duration — одразу насіння прогресу в БД + локальне оновлення
const seededRef = useRef(false);
useEffect(() => {
  if (!userId || !lesson?.id || !duration || seededRef.current) return;
  seededRef.current = true;

  // локально одразу порахувати % (щоб смужка в сайдбарі зрушила без очікування чергового timeupdate)
  onProgressTick?.({
    lessonId: lesson.id,
    watched_seconds: Math.floor(Math.min(current || 0, duration)),
    total_seconds: Math.floor(duration),
    completed: false,
  });

  // і відправити один «посівний» POST у бекенд
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


  // ⬇️ встав це поруч із іншими useEffect у SafeVideo
useEffect(() => {
  if (!lesson?.youtube_id) return;

  // почекаємо 2 c: якщо duration досі 0 — тягнемо метадані напряму з бекенду
  const t = setTimeout(async () => {
    if (duration > 0) return;
    try {
      const r = await fetch(`${BACKEND}/api/bunny/meta/${lesson.youtube_id}`);
      if (!r.ok) return;
      const j = await r.json(); // { length: <секунди> }
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
  }, [lesson?.id]);

  /// підписаний iframe URL (нормалізація query через URL API)
useEffect(() => {
  let cancelled = false;

  (async () => {
    // 1) валідація уроку/GUID
    if (!lesson || !isBunnyGuid(lesson.youtube_id)) {
      console.debug("[SV] lesson missing or not Bunny GUID:", lesson?.youtube_id);
      setVideoUrl(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // 2) тягнемо URL з бекенду
      const res = await fetch(`${BACKEND}/api/bunny/embed/${lesson.youtube_id}`);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.warn("[SV] embed fetch !ok", res.status, txt);
        if (!cancelled) setVideoUrl(null);
        return;
      }

      const j = await res.json().catch(() => ({}));
      let url = j.url || null;

      // 3) нормалізуємо query-параметри через URL — перезаписуємо все потрібне
      if (url) {
        try {
          const u = new URL(url);
          u.searchParams.set("autoplay", "true");
          u.searchParams.set("muted", "true");
          u.searchParams.set("controls", "true");
          u.searchParams.set("playerId", "ank");
          u.searchParams.set("transparent", "false");
          // (опційно) прибрати шумний RUM-скрипт Bunny
          // u.searchParams.set("disableRUM", "true");

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
  // залежність по конкретному GUID, щоб не тригерити зайвий раз
}, [lesson?.youtube_id]);


  // слухач подій Bunny
  useEffect(() => {
    if (!videoUrl) return;

    const ORIGIN_OK = (origin) => {
      // Bunny iframe зазвичай з *.mediadelivery.net
      return /mediadelivery\.net/i.test(origin) || /bunnycdn/i.test(origin);
    };

    const handler = (e) => {
      try {
        if (!ORIGIN_OK(String(e.origin))) {
          // покажемо, що щось прилетіло, але не з очікуваного origin
          console.debug("[SV] postMessage (ignored origin)", e.origin, e.data);
          return;
        }
        const data = e.data ?? {};
        const ev = data.event || data.type || data.action || "unknown";
        console.debug("[SV] postMessage", ev, data);

        // різні варіанти полів часу
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

        if (typeof dur === "number" && dur > 0) {
          setDuration(dur);
        }

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

    // активуємо слухач
    window.addEventListener("message", handler);

    // активно питаємо час/тривалість (на випадок, якщо автоподії не йдуть)
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

    // якщо через 2 сек не знаємо duration — ще раз “підштовхнемо”
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

  // локальні тики кожні ~10с
useEffect(() => {
  const total = duration || 0;
  const watched = total ? Math.min(current, total) : current;

  const bucket = Math.floor((watched || 0) / 10);
  if (bucket !== lastBucketRef.current) {
    lastBucketRef.current = bucket;
    onProgressTick?.({
      lessonId: lesson?.id,
      watched_seconds: Math.floor(watched || 0),
      total_seconds: Math.floor(total),   // спершу 0, потім встановиться з метаданих/плеєра
      completed: total > 0 && watched >= total - 2,
    });
  }

  // кнопка «далі» тільки коли відомо total
  if (total > 0) {
    const remaining = Math.max(0, total - watched);
    if (remaining <= 10) setShowNext(true);
  }
}, [current, duration, lesson?.id, onProgressTick]);

  // періодичний пуш у бекенд
  useEffect(() => {
    if (!userId || !lesson?.id) return;

    const save = async () => {
      if (!duration) return;
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
      // фінальний пуш
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
        {/* debug кнопка, щоб перевірити бекенд прогрес */}
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

            // позначаємо як завершений
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

  const refreshAfterLessonComplete = async () => {
  if (!user?.id) return;

  try {
    // 1) Загальний прогрес курсу
    const resCourse = await fetch(`${BACKEND}/api/progress/course/${user.id}`);
    const dataCourse = await resCourse.json();
    setOverallProgress(dataCourse.percent ?? 0);

    // 2) Деталі прогресу користувача по уроках + XP/Level
    const resUser = await fetch(`${BACKEND}/api/progress/user/${user.id}`);
    const dataUser = await resUser.json();

    const map = {};
    (dataUser.progress || []).forEach((p) => (map[p.lesson_id] = p));
    setProgress(map);

    // 3) Оновити XP/Level у локальному user, щоб перерендерився DashboardSection
    setUser((prev) =>
      prev
        ? { ...prev, xp: dataUser.xp ?? prev.xp, level: dataUser.level ?? prev.level }
        : prev
    );
  } catch (e) {
    console.warn("⚠️ refreshAfterLessonComplete failed", e);
  }
};

  // нове: прогрес мапою { [lessonId]: {watched_seconds,total_seconds,completed,homework_done} }
  const [progress, setProgress] = useState({});
  // нове: загальний відсоток курсу
  const [overallProgress, setOverallProgress] = useState(0);

  const [view, setView] = useState("dashboard");
  const t = (ua, ru) => (i18n.language === "ru" ? ru : ua);

  // анти-копі
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleSelectStart = (e) => e.preventDefault();
    const handleCopy = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("copy", handleCopy);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

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

    // мапа прогресу
    fetch(`${BACKEND}/api/progress/user/${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        const map = {};
        (data.progress || []).forEach((p) => (map[p.lesson_id] = p));
        setProgress(map);
      })
      .catch(() => {});

    // відсоток курсу
    fetch(`${BACKEND}/api/progress/course/${user.id}`)
      .then((r) => r.json())
      .then((data) => setOverallProgress(data.percent ?? 0))
      .catch(() => setOverallProgress(0));
  }, [user]);

  // локальне оновлення від SafeVideo (щоб смужка рухалась без перезавантаження)
  const handleProgressTick = ({ lessonId, watched_seconds, total_seconds, completed }) => {
    if (!lessonId) return;
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

  // поточний прогрес по вибраному уроку
const progSelected = selectedLesson ? (progress[selectedLesson.id] || {}) : {};

// 🔘 Позначити / скасувати виконання домашки (пише у бекенд)
const toggleHomeworkDone = async (done) => {
  if (!user?.id || !selectedLesson?.id) return;
  try {
    const r = await fetch(`${BACKEND}/api/progress/homework`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        lesson_id: selectedLesson.id,
        homework_done: !!done, // <- важливо
      }),
    });

    if (!r.ok) throw new Error("bad status " + r.status);

    // локально оновити стан, щоб UI миттєво змінився
    setProgress((prev) => ({
      ...prev,
      [selectedLesson.id]: {
        ...(prev[selectedLesson.id] || {}),
        homework_done: !!done,
      },
    }));

    // підтягнути XP/level (бо +10 XP при first True)
    await refreshAfterLessonComplete();
  } catch (e) {
    console.warn("toggleHomeworkDone failed", e);
    alert(t("Не вдалося оновити статус домашнього завдання", "Не удалось обновить статус домашнего задания"));
  }
};


// ✅ Ручне завершення уроку
const markLessonComplete = async () => {
  if (!user?.id || !selectedLesson?.id) return;
  try {
    await fetch(`${BACKEND}/api/progress/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        lesson_id: selectedLesson.id,
        completed: true,
        watched_seconds: Math.max(progSelected.watched_seconds ?? 0, progSelected.total_seconds ?? 0),
        total_seconds: progSelected.total_seconds ?? 0,
        homework_done: progSelected.homework_done ?? false,
      }),
    });

    setProgress((prev) => ({
      ...prev,
      [selectedLesson.id]: {
        ...(prev[selectedLesson.id] || {}),
        completed: true,
        watched_seconds: Math.max(progSelected.watched_seconds ?? 0, progSelected.total_seconds ?? 0),
      },
    }));

    // підтягнути глобальний прогрес/XP
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
      {/* HEADER */}
      <header
  className={`md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-5 py-4 border-b backdrop-blur-xl z-20 rounded-b-[6px] ${
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

      {/* SIDEBAR */}
      <aside
        className={`w-72 flex flex-col fixed md:static top-0 h-screen transition-transform duration-300 z-10 border-r backdrop-blur-xl ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${darkMode ? "border-fuchsia-900/30 bg-[#1a0a1f]/80" : "border-pink-200 bg-white/80"} md:pt-0 pt-16`}
      >
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex flex-col items-center text-center mb-4 group select-none">
            <SquareUserRound className="w-16 h-16 text-pink-500 mb-2 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="font-bold text-lg group-hover:text-pink-600 transition-colors">
              {user.name || user.email.split("@")[0]}
            </h2>
            <div className="mt-1">
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
                        const percent =
  prog && prog.total_seconds > 0
    ? Math.min(100, Math.max(0, Math.round((prog.watched_seconds / prog.total_seconds) * 100)))
    : 0;
                        const done = !!prog?.completed;
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
        </div>

        {/* FOOTER OF SIDEBAR */}
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
                darkMode ? "bg-gradient-to-r from-pink-500 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]" : "bg-pink-200"
              }`}
            >
              <span className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-500 ease-out ${darkMode ? "translate-x-6" : "translate-x-0"}`}></span>
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
              <ModulesPage modules={modules} darkMode={darkMode} t={t} onBack={() => setView("dashboard")} />
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
                <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
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

            {/* Домашка + Матеріали + квадратик справа */}
            <div className="mt-6 grid md:grid-cols-[1fr_auto] gap-4 items-start">
              {/* Ліва колонка: тексти/картки */}
              <div className="space-y-4">
                {/* Домашка */}
                {selectedLesson.homework && (
                  <div
                    className={`p-4 rounded-xl border ${
                      darkMode
                        ? "bg-fuchsia-950/40 border-fuchsia-800/40 text-gray-100"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    }`}
                  >
                    <h3 className="font-semibold mb-2 text-pink-600 dark:text-fuchsia-300">
                      {t("Домашнє завдання", "Домашнее задание")}
                    </h3>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedLesson.homework}
                    </p>

                    {/* Кнопки під домашкою (mobile-first) */}
                    <div className="mt-4 flex items-center gap-3 md:hidden">
                      {!progSelected.homework_done ? (
                        <button
                          onClick={() => toggleHomeworkDone(true)}
                          className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:opacity-95 transition"
                        >
                          {t("Позначити ДЗ виконаним", "Отметить ДЗ выполненным")}
                        </button>
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-2 text-emerald-600 font-medium">
                            <CheckSquare className="w-4 h-4" />
                            {t("Домашнє завдання виконано", "Домашнее задание выполнено")}
                          </span>
                          <button
                            onClick={() => toggleHomeworkDone(false)}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-fuchsia-800/40 dark:text-gray-200 dark:hover:bg-fuchsia-950/30 transition"
                          >
                            {t("Скасувати", "Отменить")}
                          </button>
                        </>
                      )}
                    </div>
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
                    <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
                      {t("Матеріали", "Материалы")}
                    </h3>
                    <a
                      href={selectedLesson.materials}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm font-medium hover:underline"
                    >
                      {t("Відкрити посилання", "Открыть ссылку")}
                    </a>
                  </div>
                )}
              </div>

              {/* Права колонка: квадрат-тогл статусу ДЗ (sticky на десктопі) */}
              {selectedLesson.homework && (
                <div className="md:sticky md:top-4 flex md:block items-start">
                  <button
                    onClick={() => toggleHomeworkDone(!progSelected.homework_done)}
                    aria-label={
                      progSelected.homework_done
                        ? t("Скасувати позначку ДЗ", "Снять отметку ДЗ")
                        : t("Позначити ДЗ виконаним", "Отметить ДЗ выполненным")
                    }
                    title={
                      progSelected.homework_done
                        ? t("Скасувати позначку ДЗ", "Снять отметку ДЗ")
                        : t("Позначити ДЗ виконаним", "Отметить ДЗ выполненным")
                    }
                    className={`group w-14 h-14 rounded-xl border flex items-center justify-center transition-all select-none
                      ${
                        progSelected.homework_done
                          ? "bg-emerald-500 border-emerald-600 text-white shadow-md hover:opacity-95"
                          : darkMode
                          ? "border-fuchsia-800/40 bg-fuchsia-950/30 text-fuchsia-100 hover:bg-fuchsia-900/30"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {progSelected.homework_done ? (
                      <CheckSquare className="w-6 h-6" />
                    ) : (
                      <div className="w-5 h-5 border-2 rounded-[6px] border-current opacity-70 group-hover:opacity-100" />
                    )}
                  </button>

                  <div className="mt-2 text-center text-xs opacity-70 md:block hidden">
                    {progSelected.homework_done
                      ? t("ДЗ виконано", "ДЗ выполнено")
                      : t("Позначити ДЗ", "Отметить ДЗ")}
                  </div>
                </div>
              )}
            </div>
             </div> 
       )} 


        {/* Footer */}
        <footer className={`mt-10 text-center py-6 text-sm border-t ${darkMode ? "border-fuchsia-900/30 text-fuchsia-100/80" : "border-pink-200 text-gray-600"}`}>
          <p className="font-medium">
            © {new Date().getFullYear()} <span className="text-pink-500 font-semibold">ANK Studio LMS</span> • {t("Усі права захищені.", "Все права защищены.")}
          </p>
        </footer>
      </main>
    </div>
  );
}

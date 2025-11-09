import { useEffect, useMemo, useState } from "react";
import { CheckSquare, Award, Info, X, ChevronRight, Lock, FileDown, Send } from "lucide-react";

const BACKEND = "https://anknails-backend-production.up.railway.app";

/* 🎨 Кольори (light) */
const STAGE_COLORS = {
  1: "from-pink-100 to-pink-50 border-pink-200 text-pink-600",
  2: "from-rose-100 to-rose-50 border-rose-200 text-rose-600",
  3: "from-fuchsia-100 to-pink-50 border-fuchsia-200 text-fuchsia-600",
  4: "from-violet-100 to-purple-50 border-violet-200 text-violet-600",
  5: "from-yellow-100 to-amber-50 border-yellow-300 text-yellow-700",
};

/* 🌚 Кольори (dark) */
const STAGE_COLORS_DARK = {
  1: "from-[#2a0f2a] to-[#1a0a1f] border-fuchsia-800/40 text-pink-200",
  2: "from-[#2a0f1c] to-[#14080e] border-rose-800/40 text-rose-200",
  3: "from-[#150a2a] to-[#0e071b] border-fuchsia-800/40 text-fuchsia-200",
  4: "from-[#0f0a2a] to-[#07061a] border-violet-800/40 text-violet-200",
  5: "from-[#2a210a] to-[#120a06] border-amber-800/40 text-amber-200",
};

export default function DashboardSection({
  modules,
  lessons,
  progress,
  overallProgress,
  darkMode,
  t,
  user,
  onOpenModules,
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [skills, setSkills] = useState(user?.xp || 0);
  const [stage, setStage] = useState(user?.level || 1);
  const [localLessons, setLocalLessons] = useState(lessons || {});

  /* ====== Сертифікат: статус із бекенду ====== */
  const [certInfoOpen, setCertInfoOpen] = useState(false);
  const [certStatus, setCertStatus] = useState({
    unlocked: false,
    unlock_at: null,        // ISO
    seconds_left: 0,
    requested: false,
    approved: false,
  });

  // тік для інфо-таймера (тільки в підказці)
  const [nowTs, setNowTs] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const unlockAtMs = useMemo(
    () => (certStatus.unlock_at ? new Date(certStatus.unlock_at).getTime() : null),
    [certStatus.unlock_at]
  );
  const secondsLeft = useMemo(() => {
    if (!unlockAtMs) return 0;
    const left = Math.max(0, Math.floor((unlockAtMs - nowTs) / 1000));
    return left;
  }, [unlockAtMs, nowTs]);

  const pad = (n) => String(n).padStart(2, "0");
  const d = Math.floor(secondsLeft / 86400);
  const h = Math.floor((secondsLeft % 86400) / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  const countdownStr = `${d}${t("д", "д")} ${pad(h)}:${pad(m)}:${pad(s)}`;

  const unlocked = !!certStatus.unlocked;

  // 🧩 XP/Level
  useEffect(() => {
    if (!user?.id) return;
    fetch(`${BACKEND}/api/progress/user/${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.xp !== undefined) {
          setSkills(data.xp);
          setStage(data.level);
        }
      })
      .catch(() => {});
  }, [user?.id]);

  // 🧠 К-сть уроків в модулях
  useEffect(() => {
    if (!modules?.length) return;
    (async () => {
      const updated = {};
      for (const m of modules) {
        try {
          const r = await fetch(`${BACKEND}/api/lessons/${m.id}`);
          const j = await r.json();
          updated[m.id] = j.lessons || [];
        } catch {}
      }
      setLocalLessons(updated);
    })();
  }, [modules]);

  // 🧾 Статус сертифіката з бекенду
  const loadCertStatus = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${BACKEND}/api/cert/status?user_id=${user.id}`);
      const data = await res.json();
      setCertStatus({
        unlocked: !!data.unlocked,
        unlock_at: data.unlock_at ?? null,
        seconds_left: data.seconds_left ?? 0,
        requested: !!data.requested,
        approved: !!data.approved,
      });
    } catch (e) {
      // тихо ігноруємо
    }
  };

  useEffect(() => {
    loadCertStatus();
  }, [user?.id]);

  // 🧮 Обчислення рівня
  const completedLessons = Object.values(progress).filter((p) => p.completed).length;
  const realSkills = skills ?? completedLessons * 20;
  const realStage = Math.min(stage ?? Math.floor(realSkills / 100) + 1, 5);
  const nextStageSkills = 100 * realStage;
  const progressToNext = ((realSkills % 100) / 100) * 100;

  // 🎨 Палітра блоку «Моя майстерність»
  const stageColor =
    (darkMode ? STAGE_COLORS_DARK : STAGE_COLORS)[realStage] ||
    (darkMode ? STAGE_COLORS_DARK[5] : STAGE_COLORS[5]);

  /* === Дії з сертифікатом === */
  const handleRequestCert = async () => {
    if (!user?.id || !user?.session_token) return;
    try {
      const res = await fetch(`${BACKEND}/api/cert/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, session_token: user.session_token }),
      });
      const j = await res.json();
      if (j.success) {
        setCertStatus((prev) => ({ ...prev, requested: true }));
        alert(
          t(
            "Запит на сертифікат відправлено. Ми повідомимо, коли його буде схвалено.",
            "Запрос на сертификат отправлен. Мы сообщим, когда он будет одобрен."
          )
        );
      } else {
        throw new Error("request failed");
      }
    } catch (e) {
      alert(
        t(
          "Не вдалося подати запит. Спробуйте пізніше.",
          "Не удалось отправить запрос. Попробуйте позже."
        )
      );
    }
  };

  const handleDownloadCert = () => {
    if (!user?.id) return;
    const url = `${BACKEND}/api/cert/generate?user_id=${user.id}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* === Рендер === */
  return (
    <div
      className={`min-h-[calc(100vh-8rem)] flex flex-col justify-between ${
        darkMode ? "text-fuchsia-100" : "text-gray-800"
      }`}
    >
      {/* ====== Контент дашборду ====== */}
      <div className="flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 📦 Модулі */}
          <div
            onClick={() => onOpenModules && onOpenModules()}
            className={`relative p-6 rounded-2xl border shadow-md transition overflow-y-auto max-h-[400px] cursor-pointer hover:scale-[1.02] ${
              darkMode
                ? "bg-[#1a0a1f]/70 border-fuchsia-900/30 hover:border-pink-500/40"
                : "bg-white border-pink-200 hover:border-pink-400/70"
            }`}
          >
            <h3 className="text-xl font-bold mb-3 text-pink-600 flex justify-between items-center">
              <span>{t("Мої модулі", "Мои модули")}</span>
              <span className="flex items-center gap-1 text-sm text-pink-400 opacity-80">
                {t("переглянути всі", "посмотреть все")}
                <ChevronRight className="w-4 h-4 text-pink-400" />
              </span>
            </h3>

            {modules.length === 0 ? (
              <p className="text-sm opacity-70">
                {t("Модулів поки що немає", "Модулей пока нет")}
              </p>
            ) : (
              <ul className="space-y-2">
                {modules.slice(0, 3).map((mod) => (
                  <li
                    key={mod.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                      darkMode ? "bg-fuchsia-950/40" : "bg-pink-50"
                    }`}
                  >
                    <span className="font-medium">{mod.title}</span>
                    <span className="text-sm text-pink-500">
                      {(localLessons[mod.id]?.length || 0)} {t("уроків", "уроков")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 💅 Моя майстерність */}
          <div
            className={`relative p-6 rounded-2xl border shadow-md overflow-hidden transition-all duration-700 bg-gradient-to-br ${stageColor}`}
          >
            {/* ℹ️ Кнопка інформації */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/20 transition z-10"
              title={t("Як підвищити майстерність", "Как развивать мастерство")}
            >
              {showInfo ? <X className="w-5 h-5 text-yellow-500" /> : <Info className="w-5 h-5" />}
            </button>

            {/* контент */}
            <div className={`transition-all duration-700 ${showInfo ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
              <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                {t("Моя майстерність", "Моё мастерство")}
              </h3>

              <div className="text-center">
                <p className="text-5xl font-extrabold mb-1">
                  {t("Рівень", "Уровень")} {realStage}
                </p>

                <p className="text-sm opacity-80 mb-3">
                  {realSkills} {t("навичок", "навыков")} / {nextStageSkills} {t("навичок", "навыков")}
                </p>

                <div className="h-2 w-full bg-white/30 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-pink-500 transition-all duration-700"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>

                <p className="text-xs opacity-80">
                  {t("До наступного рівня залишилось", "До следующего уровня осталось")} {100 - (realSkills % 100)}{" "}
                  {t("навичок", "навыков")}
                </p>
              </div>
            </div>

            {/* інфо-вікно */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-center p-8 transition-all duration-700 ${
                showInfo ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="absolute inset-0 rounded-2xl bg-white/70 backdrop-blur-md border border-white/40"></div>
              <div className="relative z-0">
                <h3 className="text-lg md:text-xl font-bold mb-2 leading-tight tracking-tight break-words px-2">
                  {t("Як розвивати майстерність", "Как развивать мастерство")}
                </h3>
                <p className="text-sm md:text-base font-medium leading-relaxed max-w-md mx-auto mb-5">
                  {t(
                    "Проходьте уроки, щоб розвивати свої навички. Кожен завершений урок додає 20 одиниць майстерності. Кожні 100 — новий рівень! Виконуйте домашні завдання — бонусні 10 одиниць.",
                    "Проходите уроки, чтобы развивать навыки. За каждый урок начисляется 20 единиц мастерства. Каждые 100 — новый уровень! Выполняйте домашние задания — бонусные 10 единиц."
                  )}
                </p>

                {/* 🆕 Пояснення про сертифікати з таймером тут */}
                {certStatus.unlock_at && !unlocked && (
                  <div className="mt-4 text-sm">
                    <p className="font-semibold mb-1">
                      {t(
                        "Доступ до сторінки з сертифікатами буде доступний через:",
                        "Доступ к странице с сертификатами будет доступен через:"
                      )}
                    </p>
                    <p className="font-mono text-lg">
                      {countdownStr}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 📈 Прогрес курсу */}
          <div
            className={`p-6 rounded-2xl border shadow-md transition ${
              darkMode ? "bg-[#1a0a1f]/70 border-fuchsia-900/30" : "bg-white border-pink-200"
            }`}
          >
            <h3 className="text-xl font-bold mb-3 text-pink-600">{t("Прогрес курсу", "Прогресс курса")}</h3>
            <div className="text-center">
              <p className="text-5xl font-extrabold text-pink-500 mb-2">{overallProgress}%</p>
              <div className="h-2 w-full bg-pink-100 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-700" style={{ width: `${overallProgress}%` }} />
              </div>
              <p className="text-sm opacity-70">
                {t("Ви переглянули", "Вы просмотрели")} {completedLessons} {t("уроків з", "уроков из")}{" "}
                {Object.values(progress).length}
              </p>
            </div>
          </div>

          {/* 🧾 Домашні завдання */}
          <div
            className={`p-6 rounded-2xl border shadow-md transition ${
              darkMode ? "bg-[#1a0a1f]/70 border-fuchsia-900/30" : "bg-white border-pink-200"
            }`}
          >
            <h3 className="text-xl font-bold mb-3 text-pink-600 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-pink-500" />
              {t("Домашні завдання", "Домашние задания")}
            </h3>
            <p className="text-sm opacity-80 mb-2">
              {t("Виконано завдань:", "Выполнено заданий:")}{" "}
              {Object.values(progress).filter((p) => p.homework_done).length}
            </p>
            <div className="h-2 w-full bg-pink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
                style={{
                  width: `${
                    (Object.values(progress).filter((p) => p.homework_done).length /
                      Math.max(Object.values(progress).length, 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* 🎓 Сертифікат */}
          <div
            className={`relative p-6 rounded-2xl border shadow-md transition overflow-hidden ${
              darkMode ? "bg-[#0f0016]/70 border-fuchsia-900/30" : "bg-white border-pink-200"
            }`}
          >
            {/* Іконка інформації зверху праворуч */}
            <button
              onClick={() => setCertInfoOpen((v) => !v)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
              title={t("Інформація про сертифікат", "Информация о сертификате")}
            >
              {certInfoOpen ? <X className="w-5 h-5 text-pink-500" /> : <Info className="w-5 h-5 text-pink-500" />}
            </button>

            {/* Підказка-«бабл» */}
            {certInfoOpen && (
              <div
                className={`absolute top-12 right-3 z-20 w-80 text-sm rounded-xl border shadow-xl p-4
                ${darkMode ? "bg-[#1a0a1f]/90 border-fuchsia-900/40 text-fuchsia-100" : "bg-white/95 border-pink-200 text-gray-700"} backdrop-blur`}
              >
                <p className="font-semibold mb-1">{t("Доступ до сертифікату", "Доступ к сертификату")}</p>
                <p className="opacity-80 leading-relaxed">
                  {unlocked
                    ? t(
                        "Ви можете подати запит на іменний сертифікат, після підтвердження в адмінці з’явиться кнопка завантаження.",
                        "Вы можете отправить заявку на именной сертификат, после подтверждения в админке появится кнопка скачивания."
                      )
                    : t(
                        "Сторінка із сертифікатами відкриється через встановлений період після першого входу. Нижче вказано дату відкриття.",
                        "Страница с сертификатами откроется через установленный период после первого входа. Ниже указана дата открытия."
                      )}
                </p>
              </div>
            )}

            {/* Контент картки (розмиваємо, якщо заблоковано) */}
            <div className={`${!unlocked ? "blur-[2px] select-none pointer-events-none" : ""}`}>
              <h3 className="text-xl font-bold mb-3 text-pink-600 flex items-center gap-2">
                🎓 {t("Мій сертифікат", "Мой сертификат")}
              </h3>

              <p className={`text-sm mb-4 ${darkMode ? "text-fuchsia-100/80" : "text-gray-600"}`}>
                {t(
                  "Після схвалення запиту ви зможете завантажити іменний сертифікат про проходження курсу.",
                  "После одобрения заявки вы сможете скачать именной сертификат о прохождении курса."
                )}
              </p>

              {/* Кнопки за статусом */}
              {unlocked && !certStatus.approved && !certStatus.requested && (
                <button
                  onClick={handleRequestCert}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-[1.02] active:scale-[0.99] transition"
                >
                  <Send className="w-5 h-5" />
                  {t("Подати запит на сертифікат", "Отправить запрос на сертификат")}
                </button>
              )}

              {unlocked && certStatus.requested && !certStatus.approved && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  ⏳ {t("Запит відправлено — очікує підтвердження", "Запрос отправлен — ждёт подтверждения")}
                </span>
              )}

              {unlocked && certStatus.approved && (
                <button
                  onClick={handleDownloadCert}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-[1.02] active:scale-[0.99] transition"
                >
                  <FileDown className="w-5 h-5" />
                  {t("Завантажити сертифікат", "Скачать сертификат")}
                </button>
              )}
            </div>

            {/* Оверлей блокування: БЕЗ таймера, тільки дата */}
            {!unlocked && (
              <div
                className={`absolute inset-0 z-10 flex flex-col items-center justify-center
                ${darkMode ? "bg-black/40" : "bg-white/60"} backdrop-blur-md`}
              >
                <div className="flex flex-col items-center text-center px-6">
                  <Lock className="w-10 h-10 mb-2 text-pink-500" />
                  {certStatus.unlock_at && (
                    <p className="text-sm opacity-85">
                      {t("Дата відкриття", "Дата открытия")}:{" "}
                      {new Date(certStatus.unlock_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====== Футер дашборду ====== */}
      <footer
        className={`mt-8 text-center py-6 text-sm border-t
                    ${darkMode ? "border-fuchsia-900/30 text-fuchsia-100/80" : "border-pink-200 text-gray-600"}`}
      >
        <p className="font-medium">
          © {new Date().getFullYear()} <span className="text-pink-500 font-semibold">ANK Studio LMS</span> •{" "}
          {t("Усі права захищені.", "Все права защищены.")}
        </p>
      </footer>
    </div>
  );
}

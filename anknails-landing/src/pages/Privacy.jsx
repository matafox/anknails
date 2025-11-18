import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Shield,
  Cookie,
  Activity,
  Database,
  Globe2,
  FileCheck,
  Lock,
  Mail,
  ChevronLeft,
} from "lucide-react";

export default function PrivacyPage() {
  const { i18n } = useTranslation();
  const T = (ua, ru) => (i18n.language === "ru" ? ru : ua);

  // ⬇️ Скидання скролу при завантаженні сторінки
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.title = T(
      "Політика конфіденційності — ANK Studio",
      "Политика конфиденциальности — ANK Studio"
    );
  }, [i18n.language]);

  const [consent, setConsent] = useState("unknown");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ga_consent");
      setConsent(saved || "unknown");
    } catch {}
  }, []);

  const updateConsent = (val) => {
    try {
      const g = typeof window !== "undefined" ? window.gtag : null;
      g &&
        g("consent", "update", {
          analytics_storage: val,
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          functionality_storage: "granted",
          security_storage: "granted",
        });
      if (val === "granted") {
        localStorage.setItem("ga_consent", "granted");
      } else {
        localStorage.setItem("ga_consent", "denied");
      }
      setConsent(val);
    } catch {}
  };

  const backHome = () => {
    if (history.length > 1) history.back();
    else window.location.href = "/";
  };

  const Section = ({ icon: Icon, title, children }) => (
    <section
      className="rounded-2xl p-5 border mb-5
                 bg-white/90 dark:bg-[#141017]/90
                 border-pink-200/60 dark:border-fuchsia-900/40"
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-pink-500" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </section>
  );

  return (
    <div
      className="
        min-h-screen w-full px-4 sm:px-6 
        pt-3 sm:pt-4 pb-10 sm:pb-14
        mt-[-1.5rem] sm:mt-[-2rem]
        bg-gradient-to-b from-[#f6f0ff] via-[#fff] to-[#fdf9ff]
        dark:from-[#100d16] dark:via-[#18141f] dark:to-[#100d16]
        text-gray-800 dark:text-fuchsia-100
      "
    >
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <button
          onClick={backHome}
          className="inline-flex items-center gap-2 text-sm mb-4 text-pink-600 dark:text-fuchsia-200 hover:opacity-90"
        >
          <ChevronLeft className="w-4 h-4" />
          {T("Назад", "Назад")}
        </button>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400">
          {T("Політика конфіденційності", "Политика конфиденциальности")}
        </h1>
        <p className="text-sm opacity-70 mb-5">
          {T("Останнє оновлення:", "Последнее обновление:")} 11.11.2025
        </p>

        {/* Consent status / controls */}
        <Section
          icon={Cookie}
          title={T(
            "Керування згодою на cookies",
            "Управление согласием на cookies"
          )}
        >
          <p className="mb-3">
            {T(
              "Ми використовуємо аналітичні cookies лише за твоєї згоди. Ти можеш змінити вибір нижче:",
              "Мы используем аналитические cookies только с твоего согласия. Ты можешь изменить выбор ниже:"
            )}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-lg border border-pink-300/70 dark:border-fuchsia-800/60">
              {T("Поточний статус:", "Текущий статус:")}{" "}
              <b>
                {consent === "granted"
                  ? T("дозволено", "разрешено")
                  : consent === "denied"
                  ? T("відхилено", "отклонено")
                  : T("не вибрано", "не выбрано")}
              </b>
            </span>
            <button
              onClick={() => updateConsent("granted")}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:scale-[1.02] transition"
            >
              {T("Прийняти аналітику", "Принять аналитику")}
            </button>
            <button
              onClick={() => updateConsent("denied")}
              className="px-3 py-2 rounded-lg text-sm font-semibold border border-pink-300/70 dark:border-fuchsia-800/60 text-pink-700 dark:text-fuchsia-200 hover:bg-pink-50 dark:hover:bg-white/5 transition"
            >
              {T("Відхилити", "Отклонить")}
            </button>
          </div>
        </Section>

        {/* Who we are */}
        <Section icon={Shield} title={T("Хто ми", "Кто мы")}>
          <p>
            {T(
              "ANK Studio Online — освітня платформа з курсами. Ми поважаємо приватність і обробляємо мінімально необхідні дані.",
              "ANK Studio Online — образовательная платформа с курсами. Мы уважаем приватность и обрабатываем минимально необходимые данные."
            )}
          </p>
        </Section>

        {/* What we collect */}
        <Section
          icon={Database}
          title={T("Які дані ми збираємо", "Какие данные мы собираем")}
        >
          <ul className="list-disc pl-5 space-y-1">
            <li>
              {T(
                "Облікові дані: email, ім’я (за наявності), термін доступу.",
                "Учётные данные: email, имя (при наличии), срок доступа."
              )}
            </li>
            <li>
              {T(
                "Дані навчання: прогрес у модулях/уроках, статуси завдань.",
                "Данные обучения: прогресс по модулям/урокам, статусы заданий."
              )}
            </li>
            <li>
              {T(
                "Платежі: сума/дата/курс (без збереження повних даних карток).",
                "Платежи: сумма/дата/курс (без хранения полных данных карт)."
              )}
            </li>
            <li>
              {T(
                "Аналітика: агреговані події відвідуваності (через Google Analytics 4) — тільки за згодою.",
                "Аналитика: агрегированные события посещаемости (через Google Analytics 4) — только при согласии."
              )}
            </li>
          </ul>
        </Section>

        {/* Cookies */}
        <Section icon={Cookie} title={T("Cookies", "Cookies")}>
          <p className="mb-2">
            {T(
              "Технічні cookies потрібні для роботи сайту (сесії, безпека). Аналітичні cookies (GA4) вмикаються лише після твоєї згоди.",
              "Технические cookies нужны для работы сайта (сессии, безопасность). Аналитические cookies (GA4) включаются только после твоего согласия."
            )}
          </p>
          <p className="text-xs opacity-80">
            {T(
              "Ти можеш змінити рішення у будь-який момент на цій сторінці.",
              "Ты можешь изменить решение в любой момент на этой странице."
            )}
          </p>
        </Section>

        {/* Analytics */}
        <Section icon={Activity} title={T("Аналітика (GA4)", "Аналитика (GA4)")}>
          <p className="mb-2">
            {T(
              "Ми використовуємо Google Analytics 4 для розуміння того, як користувачі взаємодіють із сайтом, щоб покращувати контент і UX.",
              "Мы используем Google Analytics 4, чтобы понимать, как пользователи взаимодействуют с сайтом, и улучшать контент и UX."
            )}
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              {T(
                "Без згоди — GA4 працює в режимі без cookies (агреговані сигнали).",
                "Без согласия — GA4 работает в режиме без cookies (агрегированные сигналы)."
              )}
            </li>
            <li>
              {T(
                "За згоди — увімкнені cookies для точнішої статистики.",
                "При согласии — включены cookies для более точной статистики."
              )}
            </li>
          </ul>
        </Section>

        {/* Sharing */}
        <Section
          icon={Globe2}
          title={T("Передача третім сторонам", "Передача третьим сторонам")}
        >
          <p className="mb-2">
            {T(
              "Ми не продаємо персональні дані. Дані можуть оброблятись постачальниками сервісів (хостинг, аналітика, email).",
              "Мы не продаём персональные данные. Данные могут обрабатываться поставщиками сервисов (хостинг, аналитика, email)."
            )}
          </p>
          <p className="text-xs opacity-80">
            {T(
              "Передача відбувається за договорами обробки даних або стандартними договірними положеннями.",
              "Передача осуществляется по договорам обработки данных или стандартным договорным положениям."
            )}
          </p>
        </Section>

        {/* Security */}
        <Section icon={Lock} title={T("Безпека", "Безопасность")}>
          <p>
            {T(
              "Ми застосовуємо технічні та організаційні заходи безпеки відповідно до галузевих практик.",
              "Мы применяем технические и организационные меры безопасности согласно отраслевым практикам."
            )}
          </p>
        </Section>

        {/* Rights */}
        <Section icon={FileCheck} title={T("Твої права (GDPR)", "Твои права (GDPR)")}>
          <ul className="list-disc pl-5 space-y-1">
            <li>{T("Доступ до даних.", "Доступ к данным.")}</li>
            <li>{T("Виправлення та видалення.", "Исправление и удаление.")}</li>
            <li>{T("Обмеження обробки.", "Ограничение обработки.")}</li>
            <li>{T("Перенесення даних.", "Перенос данных.")}</li>
            <li>
              {T(
                "Відкликання згоди на аналітику — у будь-який момент на цій сторінці.",
                "Отзыв согласия на аналитику — в любой момент на этой странице."
              )}
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}

import { useTranslation } from "react-i18next";

export default function PreEnrollFormSection() {
  const { t } = useTranslation();

  return (
    <div
      id="pre-enroll-form"
      className="w-full flex flex-col items-center py-16 px-6 bg-white/60 dark:bg-neutral-900/60 border-t border-pink-100 dark:border-neutral-700"
    >
      <h2 className="text-3xl font-bold mb-6 text-pink-600 dark:text-pink-400">
        {t("preenroll_title")}
      </h2>

      <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-xl">
        {t("preenroll_desc")}
      </p>

      <iframe
        src="https://forms.gle/rPjtEpgLnz1jBY4R6"
        width="100%"
        height="900"
        className="max-w-3xl w-full rounded-2xl shadow-lg border border-pink-100 dark:border-neutral-700"
        title={t("preenroll_title")}
      ></iframe>
    </div>
  );
}

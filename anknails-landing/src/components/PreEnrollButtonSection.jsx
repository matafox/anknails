import { FileEdit } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PreEnrollButtonSection() {
  const { t } = useTranslation();

  const handleScrollToForm = () => {
    const formSection = document.getElementById("pre-enroll-form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col items-center py-12">
      <p className="mb-4 text-center text-gray-600 dark:text-gray-300 max-w-md">
        {t("preenroll_ready")}
      </p>

      <button
        onClick={handleScrollToForm}
        className="relative flex items-center gap-2 px-6 py-3 rounded-xl
                   bg-pink-500/80 hover:bg-pink-600 text-white font-semibold 
                   shadow-lg shadow-pink-500/30 transition-all duration-300
                   backdrop-blur-md border border-white/20 active:scale-95"
      >
        <FileEdit className="w-5 h-5" />
        <span>{t("preenroll_fill")}</span>

        {/* світловий ефект */}
        <span className="absolute inset-0 rounded-xl bg-pink-400/20 opacity-0 hover:opacity-100 blur-md transition-opacity duration-300"></span>
      </button>
    </div>
  );
}

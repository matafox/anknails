import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en.json";
import ru from "./ru.json";
import uk from "./uk.json";
import pl from "./pl.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      uk: { translation: uk },
      pl: { translation: pl },
    },
    fallbackLng: "ru",
    detection: {
      order: ["cookie", "localStorage", "navigator"],
      caches: ["cookie"], // 🩶 саме це дозволяє спільний доступ між субдоменами
      cookieDomain: ".ankstudio.online", // 🔥 важливо! — працює для всіх піддоменів
    },
    interpolation: { escapeValue: false },
  });

export default i18n;

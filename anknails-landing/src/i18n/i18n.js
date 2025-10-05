import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import pl from "./pl.json";
import ru from "./ru.json";
import uk from "./uk.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pl: { translation: pl },
    ru: { translation: ru },
    uk: { translation: uk },
  },
  lng: navigator.language.split("-")[0] || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;

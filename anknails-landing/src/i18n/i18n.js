import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import pl from "./pl.json";
import ru from "./ru.json";
import uk from "./uk.json";

// зчитуємо мову з localStorage або з браузера
const savedLang = localStorage.getItem("lang");
const browserLang = navigator.language.split("-")[0];
const defaultLang = savedLang || (["ru", "uk", "pl", "en"].includes(browserLang) ? browserLang : "ru");

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pl: { translation: pl },
    ru: { translation: ru },
    uk: { translation: uk },
  },
  lng: defaultLang,
  fallbackLng: "ru",
  interpolation: { escapeValue: false },
});

// слухаємо зміну мови і зберігаємо в localStorage
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
});

export default i18n;

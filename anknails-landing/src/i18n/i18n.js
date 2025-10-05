import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import pl from "./pl.json";
import ru from "./ru.json";
import uk from "./uk.json";

// ---- 🔄 Синхронізація мови через cookie (спільна для всіх субдоменів)
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )};expires=${expires.toUTCString()};path=/;domain=.ankstudio.online;SameSite=Lax`;
}

// ---- Визначення мови
const savedLang = getCookie("lang") || localStorage.getItem("lang");
const browserLang = navigator.language.split("-")[0];
const defaultLang =
  savedLang ||
  (["ru", "uk", "pl", "en"].includes(browserLang) ? browserLang : "ru");

// ---- Ініціалізація i18next
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

// ---- При зміні мови зберігаємо в cookie + localStorage
i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem("lang", lng);
    setCookie("lang", lng);
  } catch (e) {
    console.warn("Не вдалося зберегти мову:", e);
  }
});

export default i18n;

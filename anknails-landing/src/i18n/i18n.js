import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import pl from "./pl.json";
import ru from "./ru.json";
import uk from "./uk.json";

// читаємо мову з cookie або localStorage
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

const savedLang = localStorage.getItem("lang") || getCookie("lang");
const browserLang = navigator.language.split("-")[0];
const defaultLang =
  savedLang || (["ru", "uk", "pl", "en"].includes(browserLang) ? browserLang : "ru");

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

// 🔁 Коли змінюється мова — зберігаємо і в cookie, і в localStorage
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
  document.cookie = `lang=${lng}; path=/; domain=.ankstudio.online; max-age=31536000; SameSite=Lax`;
});

export default i18n;

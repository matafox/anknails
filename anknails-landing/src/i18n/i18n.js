import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import pl from "./pl.json";
import ru from "./ru.json";
import uk from "./uk.json";

// зчитуємо мову з URL або localStorage
const urlParams = new URLSearchParams(window.location.search);
const langFromUrl = urlParams.get("lang");
const langFromStorage = localStorage.getItem("preferredLang");
const defaultLang = langFromUrl || langFromStorage || "ru";

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, pl: { translation: pl }, ru: { translation: ru }, uk: { translation: uk } },
    lng: defaultLang,
    fallbackLng: "ru",
    interpolation: { escapeValue: false },
  });

// зберігати поточну мову при зміні
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("preferredLang", lng);
});

export default i18n;

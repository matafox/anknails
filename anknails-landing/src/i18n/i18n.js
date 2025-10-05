import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import pl from "./pl.json";
import ru from "./ru.json";
import uk from "./uk.json";

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, pl: { translation: pl }, ru: { translation: ru }, uk: { translation: uk } },
    lng: localStorage.getItem("lang") || "ru",
    fallbackLng: "ru",
    interpolation: { escapeValue: false },
  });

// 🔥 Слухаємо зміну мови і зберігаємо вибір
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);

  // оновлюємо URL без перезавантаження
  const url = new URL(window.location);
  url.searchParams.set("lang", lng);
  window.history.replaceState({}, "", url);
});

export default i18n;

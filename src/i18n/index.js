import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ar from "./locales/ar.json";

function readInitialLanguage() {
  if (typeof localStorage === "undefined") {
    return "en";
  }

  return localStorage.getItem("language") || "en";
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },

  lng: readInitialLanguage(),
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

const updateDocumentLanguage = (language) => {
  // Guarded so the module can also be imported outside a browser (tests, SSR).
  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("language", language);
  }
};

updateDocumentLanguage(i18n.language);

i18n.on("languageChanged", updateDocumentLanguage);

export default i18n;
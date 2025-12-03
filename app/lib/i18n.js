
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import locales from "../../public/locals.json";

// Only initialize i18n on the client side
if (typeof window !== 'undefined') {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "fr", // Default language
      lng: "fr", // Default language
      resources: {
        en: locales.en,
        fr: locales.fr,
      },
      detection: {
        order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
      },
    });
} else {
  // Server-side initialization without LanguageDetector
  i18n
    .use(initReactI18next)
    .init({
      fallbackLng: "fr",
      lng: "fr",
      resources: {
        fr: locales.fr,
      },
    });
}

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from '../public/locales/en/common.json';
import thCommon from '../public/locales/th/common.json';

// ─── SSR-safe i18n init ──────────────────────────────────────────────────────
// We intentionally do NOT use LanguageDetector here.
// LanguageDetector would pick the browser locale on the client (e.g. "th")
// while SSR always renders with fallbackLng ("en"), causing a hydration mismatch.
//
// Instead we always start with "en" on both server and client first render.
// A companion hook / component reads localStorage and calls i18n.changeLanguage()
// inside a useEffect (client-only), so the switch happens AFTER hydration.
// ─────────────────────────────────────────────────────────────────────────────
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      lng: 'en',           // always start with EN on both SSR + client
      fallbackLng: 'en',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en: { common: enCommon },
        th: { common: thCommon },
      },
      ns: ['common'],
      defaultNS: 'common',
    });
}

export default i18n;
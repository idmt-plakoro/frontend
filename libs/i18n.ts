import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { common: require('../public/locales/en/common.json') },
      th: { common: require('../public/locales/th/common.json') },
    },
    ns: ['common'],
    defaultNS: 'common',
  });

export default i18n;
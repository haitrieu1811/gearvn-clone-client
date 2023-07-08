import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import PAGES_VI from 'src/locales/vi/pages.json';
import PAGES_EN from 'src/locales/en/pages.json';
import COMPONENTS_VI from 'src/locales/vi/components.json';
import COMPONENTS_EN from 'src/locales/en/components.json';

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
};

export const defaultNS = 'components';

export const resources = {
  en: {
    pages: PAGES_EN,
    components: COMPONENTS_EN
  },
  vi: {
    pages: PAGES_VI,
    components: COMPONENTS_VI
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  ns: ['pages', 'components'],
  defaultNS,
  fallbackLng: 'vi',
  interpolation: {
    escapeValue: false // react already safes from xss
  }
});

export default i18n;

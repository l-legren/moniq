import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';

/**
 * i18next setup. English is the source of truth. Imported for its side effect from the root layout
 * (`import '@/i18n'`) before any `t()` call. Single `translation` namespace with nested keys.
 */
if (!i18n.isInitialized) {
  // `i18n.use()` is the i18next default-export API, not the same-named `use` named export.
  // eslint-disable-next-line import/no-named-as-default-member
  i18n.use(initReactI18next).init({
    resources: { en: { translation: en } },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
}

export default i18n;

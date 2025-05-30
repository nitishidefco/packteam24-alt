import 'intl-pluralrules';
import {initReactI18next} from 'react-i18next';
import i18n from 'i18next';
import {defaultLanguage, languagesResources} from './languageConfig';
console.log(languagesResources);

// @ts-nocheck
// @ts-ignore
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // lng: languagesResources.nen,
    resources: languagesResources,
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    debug: true,
  });

export default i18n;

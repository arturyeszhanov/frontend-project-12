import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resources from './locales/index'

const i18nInstance = i18next.createInstance()

i18nInstance
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
    debug: true,
    lng: 'ru',
    compatibilityJSON: 'v3',
  })

export default i18nInstance

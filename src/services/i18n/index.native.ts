import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import { fallback, defaultNamespace, namespaces, supportedLocales } from './common'
import { format as formatDate } from 'date-fns'

const languageDetector = {
  type: 'languageDetector' as 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    callback(Localization.locale.split('-')[0])
  },
  init: () => {},
  cacheUserLanguage: () => {}
}

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: fallback,
    resources: supportedLocales,
    ns: namespaces,
    defaultNS: defaultNamespace,
    interpolation: {
      escapeValue: false,
      format: (value: Date | string, format: string): string => {
        if (value instanceof Date && format) return formatDate(value, format)
        else return value.toString()
      }
    }
  })

export default i18n

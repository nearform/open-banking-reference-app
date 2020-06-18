import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'
import { fallback, defaultNamespace, namespaces, supportedLocales } from './common'
import { format as formatDate } from 'date-fns'

const languageDetector = {
  type: 'languageDetector' as 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    const lang = RNLocalize.getLocales()[0].languageCode || 'en'
    callback(lang)
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
        if (value instanceof Date && format) {
          switch (format) {
            case 'date_do':
              // we should pass locale to formatDate too
              return formatDate(value, 'do MMM yyyy')
            default:
              return value.toISOString()
          }
        } else return value.toString()
      }
    }
  })

export default i18n

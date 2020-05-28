import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LngDetector from 'i18next-browser-languagedetector'
import { format as formatDate } from 'date-fns'

import { fallback, defaultNamespace, namespaces, supportedLocales } from './common'

i18n
  .use(LngDetector)
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
              return value.toString()
          }
        } else return value.toString()
      }
    }
  })

export default i18n

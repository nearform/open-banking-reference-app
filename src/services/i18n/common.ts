import en from '../../lang/en.json'
import pt from '../../lang/pt.json'

export const fallback = 'en'
export const defaultNamespace = 'common'
export const namespaces = ['common']

export const supportedLocales = {
  en: {
    name: 'English',
    ...en
  },
  pt: {
    name: 'Português',
    ...pt
  }
}

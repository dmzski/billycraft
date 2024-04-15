import { locales } from '@/locales'
import { GlobalLocale } from '@/locales/types'
import type { LocaleKeys, Scopes } from 'international-types'

export const useI18n = () => {

  const t = <Key extends LocaleKeys<GlobalLocale, undefined>>(key: Key) => locales.fr[key]

  const scopedT = <Scope extends Scopes<GlobalLocale>>(scope: Scope) => {
    return <Key extends LocaleKeys<GlobalLocale, Scope>>(key: Key) => {
      return locales.fr[`${scope}.${key}` as keyof GlobalLocale]
    }
  }


  return { t, scopedT }
}

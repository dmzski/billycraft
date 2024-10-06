import { createT } from '@/i18n/create-t'
import { locales } from '@/locales'
import { GlobalLocale } from '@/locales/types'
import { Scopes } from 'international-types'
import { ReactNode, createContext, useCallback, useMemo } from 'react'

type I18nProviderProps = {
  locale: string
  children: ReactNode
}

type I18nContextValue = {
  t: ReturnType<typeof createT<GlobalLocale, undefined>>
  scopedT: <Scope extends Scopes<GlobalLocale>>(
    scope: Scope,
  ) => ReturnType<typeof createT<GlobalLocale, Scope>>
}

export const I18nContext = createContext<I18nContextValue>({
  t: createT(
    {
      locale: 'fr',
      fallbackLocale: locales.fr,
      localeContent: locales.fr,
    },
    undefined,
  ),
  scopedT: () =>
    createT(
      {
        locale: 'fr',
        fallbackLocale: locales.fr,
        localeContent: locales.fr,
      },
      undefined,
    ),
})

export const I18nProvider = ({ locale, children }: I18nProviderProps) => {
  const t = useMemo(
    () =>
      createT(
        {
          locale,
          fallbackLocale: locales.fr,
          localeContent: locales.fr,
        },
        undefined,
      ),
    [locale],
  )

  const scopedT = useCallback(
    <Scope extends Scopes<GlobalLocale>>(scope: Scope) => {
      return createT(
        {
          locale,
          fallbackLocale: locales.fr,
          localeContent: locales.fr,
        },
        scope,
      )
    },
    [locale],
  )

  const value = useMemo(
    () => ({
      t,
      scopedT,
    }),
    [t, scopedT],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

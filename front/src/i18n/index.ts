import { locales } from "@/locales"
import { GlobalLocale } from "@/locales/types"


export const useI18n = () => {

  const t = (key: keyof GlobalLocale) => locales.fr[key]

  return { t }
}


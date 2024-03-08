import fr from "locales/fr"
import { GlobalLocale } from "locales/types"

export const useI18n = () => {

  const t = (key: keyof GlobalLocale) => fr[key]

  return { t }
}

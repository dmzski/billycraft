import { formatISO9075, formatRFC3339, parseJSON } from 'date-fns'
import { useCallback, useMemo } from 'react'

type UseFormatDateReturn = {
  toISO9075: (date: string | number | Date) => string
  toRFC3339: (date: string | number | Date) => string
}

export const useFormatDate = (): UseFormatDateReturn => {
  const toISO9075 = useCallback(
    (date: string | number | Date) => formatISO9075(parseJSON(date)),
    [],
  )
  const toRFC3339 = useCallback(
    (date: string | number | Date) => formatRFC3339(parseJSON(date)),
    [],
  )

  const value = useMemo(
    () => ({
      toISO9075,
      toRFC3339,
    }),
    [],
  )

  return value
}

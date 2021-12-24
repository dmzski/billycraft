import { useMemo } from 'react'

export const useFormatCurrency = () => {
  const formatter = useMemo(
    () => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format,
    [],
  )
  return formatter
}

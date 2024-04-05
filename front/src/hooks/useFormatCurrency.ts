import { useCallback } from 'react'

export const useFormatCurrency = () => {
  const formatter = useCallback(
    (value: bigint | number) =>
      new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(
        Number.isNaN(value) ? 0 : value,
      ),
    [],
  )
  return formatter
}

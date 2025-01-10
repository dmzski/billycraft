import { formatISO9075, formatRFC3339, parseJSON } from "date-fns"
import { useCallback, useMemo } from "react"

type UseFormatDateReturn = {
	toISO9075: (date: string | number | Date) => string
	toRFC3339: (date: string | number | Date) => string
}

export const useFormatDate = (): UseFormatDateReturn => {
	const toISO9075 = useCallback(
		(date: string | Date) =>
			formatISO9075(date instanceof Date ? date : parseJSON(date)),
		[],
	)
	const toRFC3339 = useCallback(
		(date: string | Date) =>
			formatRFC3339(date instanceof Date ? date : parseJSON(date)),
		[],
	)

	const value = useMemo(
		() => ({
			toISO9075,
			toRFC3339,
		}),
		[toISO9075, toRFC3339],
	)

	return value
}

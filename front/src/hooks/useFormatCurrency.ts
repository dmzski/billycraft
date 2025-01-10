import { useCallback } from "react"

export const useFormatCurrency = () => {
	const formatter = useCallback(
		(value: bigint | number) =>
			new Intl.NumberFormat("fr-FR", {
				style: "currency",
				currency: "EUR",
				maximumFractionDigits: 2,
				notation: "standard",
			}).format(Number.isNaN(value) ? 0 : value),
		[],
	)
	return formatter
}

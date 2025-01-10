import type { BillResponse, ProductType, QuoteResponse } from "@/sdk"

export function roundTwoDecimals(aPrice: number): number {
	return Math.round(aPrice * 100) / 100
}

export function calculatePriceTTC(
	price?: number | string | null,
	tva = 0,
): number {
	if (!price) {
		return 0
	}
	const typedPrice = Number.parseFloat(`${price}`)
	const computedVat = tva / 100
	return roundTwoDecimals(typedPrice * (1 + computedVat))
}

export function calculatePriceET(price?: number | string | null): number {
	if (!price) {
		return 0
	}
	return roundTwoDecimals(Number(price))
}

export function calculatePriceETFromIT(
	price?: number | string | null,
	tva = 0,
): number {
	if (!price) {
		return 0
	}
	const typedPrice = Number.parseFloat(`${price}`)
	const computedVat = tva / 100

	return roundTwoDecimals(typedPrice / (1 + computedVat))
}

export function getBillOrQuoteTotal(
	billOrQuote: BillResponse | QuoteResponse,
): number {
	const array = billOrQuote.lines
		.filter((line) => line.price && line.quantity)
		.map((line) =>
			roundTwoDecimals(
				calculatePriceTTC(line.price, billOrQuote.tva) * (line.quantity ?? 0),
			),
		)

	if (array && array.length > 0) {
		return array.reduce(
			(previousValue: number, currentValue: number) =>
				previousValue + currentValue,
		)
	}
	return 0
}

export function getBillOrQuoteTotalEt(
	billOrQuote: BillResponse | QuoteResponse,
): number {
	const array = billOrQuote.lines
		.filter((line) => line.price && line.quantity)
		.map((line) =>
			roundTwoDecimals(calculatePriceET(line.price) * (line.quantity ?? 0)),
		)

	if (array && array.length > 0) {
		return array.reduce(
			(previousValue: number, currentValue: number) =>
				previousValue + currentValue,
		)
	}
	return 0
}

export function getBillOrQuoteTotalETForLineType(
	billOrQuote: BillResponse | QuoteResponse,
	type: ProductType,
): number {
	const array = billOrQuote.lines
		.filter((line) => line.price && line.quantity && line.type === type)
		.map((line) =>
			roundTwoDecimals(
				calculatePriceET(line.price) * (line.quantity ? line.quantity : 0),
			),
		)

	if (array && array.length > 0) {
		return array.reduce(
			(previousValue, currentValue) => previousValue + currentValue,
			0,
		)
	}
	return 0
}

export function getBillOrQuoteTotalForLineType(
	billOrQuote: BillResponse | QuoteResponse,
	type: ProductType,
): number {
	const array = billOrQuote.lines
		.filter((line) => line.price && line.quantity && line.type === type)
		.map((line) =>
			roundTwoDecimals(
				calculatePriceTTC(line.price, billOrQuote.tva) *
					(line.quantity ? line.quantity : 0),
			),
		)

	if (array && array.length > 0) {
		return array.reduce(
			(previousValue, currentValue) => previousValue + currentValue,
			0,
		)
	}
	return 0
}

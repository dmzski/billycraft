import type { ProductType } from "@/sdk"

export type QuoteFormValues = {
	lines: {
		description?: string | null
		line: number
		name: string
		price?: number | null
		productId?: string | null
		quantity?: number | null
		type: ProductType
	}[]
	tva?: number
	title: string
	customerId?: string
}

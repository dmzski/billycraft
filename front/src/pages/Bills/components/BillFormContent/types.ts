import type { BillRequest, ProductType } from "@/sdk"

export type BillFormValues = {
	lines: {
		description?: string | null
		line: number
		name: string
		price?: number | null
		productId?: string | null
		quantity?: number | null
		type: ProductType
	}[]
	tva?: BillRequest["tva"]
	title: BillRequest["title"]
	customerId?: BillRequest["customerId"]
}

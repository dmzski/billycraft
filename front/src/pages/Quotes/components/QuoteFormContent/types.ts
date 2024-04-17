import { QuoteLine } from "@/models/Quote"

export type QuoteFormValues = {
  lines: Array<QuoteLine & { id?: string, itPrice: number }>
  tva: number
  title: string
  customerId: string
}

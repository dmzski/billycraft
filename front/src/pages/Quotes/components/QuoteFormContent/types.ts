import { QuoteLine } from "@/models/Quote"

export type QuoteFormValues = {
  lines: Array<QuoteLine & { id?: string }>
  tva: number
  title: string
  customerId: number
}

import { BillLine } from "@/models/Bill"

export type BillFormValues = {
  lines: Array<BillLine & { id?: string }>
  tva: number
  title: string
  customerId: number
}

import { LineTypeEnum } from "../LineTypeEnum"
import { QuoteStatusEnum } from "../Quote"

export type QuoteUpdateRequestLine = {
  line: number
  quantity?: number | null
  price?: number | null
  name: string
  description?: string | null
  type: LineTypeEnum
}

export type QuoteUpdateRequest = {
  id: string
  lines: QuoteUpdateRequestLine[]
  tva: number
  title: string
  customerId: number
  status?: QuoteStatusEnum
}

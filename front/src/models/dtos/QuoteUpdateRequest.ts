import { LineTypeEnum } from "../LineTypeEnum"
import { QuoteStatusEnum } from "../Quote"

export type QuoteUpdateRequestLine = {
  line: number
  quantity?: number
  price?: number
  name: string
  description?: string
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

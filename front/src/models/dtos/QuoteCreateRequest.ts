import { LineTypeEnum } from "../LineTypeEnum"
import { QuoteStatusEnum } from "../Quote"

export type QuoteCreateRequestLine = {
  line: number
  quantity?: number | null
  price?: number | null
  name: string
  description?: string | null
  type: LineTypeEnum
}

export type QuoteCreateRequest = {
  lines: QuoteCreateRequestLine[]
  tva: number
  title: string
  customerId: number
  status?: QuoteStatusEnum
}

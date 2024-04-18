import { LineTypeEnum } from '../LineTypeEnum'
import { QuoteStatusEnum } from '../Quote'

export type QuoteCreateRequestLine = {
  line: number
  quantity?: number
  price?: number
  name: string
  description?: string
  type: LineTypeEnum
}

export type QuoteCreateRequest = {
  lines: QuoteCreateRequestLine[]
  tva: number
  title: string
  customerId: string
  status?: QuoteStatusEnum
}

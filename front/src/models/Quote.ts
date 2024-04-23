import { LineTypeEnum } from './LineTypeEnum'

export enum QuoteStatusEnum {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED',
  DEPOSIT_ASK = 'DEPOSIT_ASK',
  ARCHIVED = 'ARCHIVED',
}

export type QuoteLine = {
  quoteId: string
  line: number
  quantity: number | null
  price: number | null
  name: string
  description: string | null
  type: LineTypeEnum
  productId: string | null
}

type Quote = {
  id: string
  name: string
  title: string
  tva: number
  createdAt: string
  updatedAt: string
  sentAt?: string
  status: QuoteStatusEnum
  createdBy: string
  companyId: string
  customerId: string
  fileName?: string
  lines: QuoteLine[]
}

export default Quote

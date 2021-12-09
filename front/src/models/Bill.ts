import { LineTypeEnum } from './LineTypeEnum'

export enum BillStatusEnum {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED',
  PAYMENT_PAID = 'PAYMENT_PAID',
  TO_DECLARE = 'TO_DECLARE',
  ARCHIVED = 'ARCHIVED',
}

export type BillLine = {
  billId: string
  line: number
  quantity?: number | null
  price?: number | null
  name: string
  description?: string | null
  type: LineTypeEnum
}

type Bill = {
  id: string
  title: string
  tva: number
  createdAt: string
  updatedAt: string
  sentAt?: string
  status: BillStatusEnum
  createdBy: string
  companyId: number
  customerId: number
  fileName: null
  lines: BillLine[]
  quoteId: string
}

export default Bill

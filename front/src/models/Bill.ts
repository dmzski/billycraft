import { LineTypeEnum } from './LineTypeEnum'

export enum BillStatusEnum {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED',
  TO_DECLARE = 'TO_DECLARE',
  ARCHIVED = 'ARCHIVED',
}

export type BillLine = {
  billId: string
  line: number
  quantity?: number
  price?: number
  name: string
  description?: string
  type: LineTypeEnum
  productId?: string
}

type Bill = {
  id: string
  name: string
  title: string
  tva: number
  createdAt: string
  updatedAt: string
  sentAt?: string
  status: BillStatusEnum
  createdBy: string
  companyId: string
  customerId: string
  fileName?: string
  lines: BillLine[]
  quoteId: string
}

export default Bill

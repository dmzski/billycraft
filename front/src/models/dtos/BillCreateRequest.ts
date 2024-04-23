import { LineTypeEnum } from '../LineTypeEnum'
import { BillStatusEnum } from '../Bill'

export type BillCreateRequestLine = {
  line: number
  quantity?: number | null
  price?: number | null
  name: string
  description?: string | null
  type: LineTypeEnum
  productId?: string | null
}

export type BillCreateRequest = {
  lines: BillCreateRequestLine[]
  tva: number
  title: string
  customerId: string
  status?: BillStatusEnum
}

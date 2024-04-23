import { LineTypeEnum } from '../LineTypeEnum'
import { BillStatusEnum } from '../Bill'

export type BillUpdateRequestLine = {
  line: number
  quantity?: number | null
  price?: number | null
  name: string
  description?: string | null
  type: LineTypeEnum
  productId?: string | null
}

export type BillUpdateRequest = {
  id: string
  lines: BillUpdateRequestLine[]
  tva: number
  title: string
  customerId: string
  status?: BillStatusEnum
}

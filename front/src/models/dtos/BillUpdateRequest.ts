import { ProductType } from '../LineTypeEnum'
import { BillStatus } from '../Bill'

export type BillUpdateRequestLine = {
  line: number
  quantity?: number | null
  price?: number | null
  name: string
  description?: string | null
  type: ProductType
  productId?: string | null
}

export type BillUpdateRequest = {
  id: string
  lines: BillUpdateRequestLine[]
  tva: number
  title: string
  customerId: string
  status?: BillStatus
}

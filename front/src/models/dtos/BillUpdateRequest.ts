import { LineTypeEnum } from "../LineTypeEnum"
import { BillStatusEnum } from "../Bill"

export type BillUpdateRequestLine = {
  line: number
  quantity?: number
  price?: number
  name: string
  description?: string
  type: LineTypeEnum
}

export type BillUpdateRequest = {
  id: string
  lines: BillUpdateRequestLine[]
  tva: number
  title: string
  customerId: string
  status?: BillStatusEnum
}

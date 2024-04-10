import { LineTypeEnum } from "../LineTypeEnum"
import { BillStatusEnum } from "../Bill"

export type BillCreateRequestLine = {
  line: number
  quantity?: number
  price?: number
  name: string
  description?: string
  type: LineTypeEnum
}

export type BillCreateRequest = {
  lines: BillCreateRequestLine[]
  tva: number
  title: string
  customerId: number
  status?: BillStatusEnum
}

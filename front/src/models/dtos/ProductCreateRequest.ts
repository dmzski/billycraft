import { LineTypeEnum } from '../LineTypeEnum'

export type ProductCreateRequest = {
  type: LineTypeEnum
  name: string
  description?: string | null
  price?: number | null
  supplierId?: string | null
}

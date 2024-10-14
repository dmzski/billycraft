import { LineTypeEnum } from '../LineTypeEnum'

export type ProductUpdateRequest = {
  id: string
  type: LineTypeEnum
  name: string
  description?: string | null
  price?: number | null
  supplierId?: string | null
  groupId?: string | null
}

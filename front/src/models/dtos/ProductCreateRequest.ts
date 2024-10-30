import { ProductType } from '../LineTypeEnum'

export type ProductCreateRequest = {
  type: ProductType
  name: string
  description?: string | null
  price?: number | null
  supplierId?: string | null
}

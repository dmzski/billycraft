import { LineTypeEnum } from '@/models/LineTypeEnum'

export type ProductFormValues = {
  type: LineTypeEnum
  name: string
  description: string | null
  price: number | null
  itPrice: number
  supplierId: string | null
  groupId: string | null
  stock: number | null
  code: string | null
  lowStock: number | null
  noStockAlert: boolean
}

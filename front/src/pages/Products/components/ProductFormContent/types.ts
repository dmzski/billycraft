import { LineTypeEnum } from '@/models/LineTypeEnum'

export type ProductFormValues = {
  type: LineTypeEnum
  name: string
  description: string | null
  price: number | null
  itPrice: number
  supplierId: string | null
  initialStock: number | null
  code: string | null
}

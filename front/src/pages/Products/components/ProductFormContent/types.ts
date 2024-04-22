import { LineTypeEnum } from '@/models/LineTypeEnum'

export type ProductFormValues = {
  type: LineTypeEnum
  name: string
  description: string | null
  price: number
  itPrice: number
  supplierId: string | null
}

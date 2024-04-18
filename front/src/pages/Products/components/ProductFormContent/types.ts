import { LineTypeEnum } from '@/models/LineTypeEnum'

export type ProductFormValues = {
  type: LineTypeEnum
  name: string
  description: string
  price: number
  supplierId: string | null
}

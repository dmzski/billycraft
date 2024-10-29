import { LineTypeEnum } from './LineTypeEnum'

interface Product {
  id: string
  type: LineTypeEnum
  name: string
  description: string
  price: number
  companyId: string
  createdBy: string
  stock?: number
  code?: string
  supplierId?: string
  groupId?: string
  lowStock?: number
  stockAlert: boolean
}

export default Product

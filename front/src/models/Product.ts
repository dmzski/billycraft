import { LineTypeEnum } from './LineTypeEnum'

interface Product {
  id: string
  type: LineTypeEnum
  name: string
  description: string
  price: number
  companyId: string
  createdBy: string
}

export default Product

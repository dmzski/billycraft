import { LineTypeEnum } from './LineTypeEnum';

interface Product {
  id: number;
  type: LineTypeEnum;
  name: string;
  description?: string;
  price?: number;
  companyId: number;
  createdBy: string;
}

export default Product;

import { LineTypeEnum } from "./LineTypeEnum";

interface Product {
  id: number;
  type: LineTypeEnum;
  name: string;
  description?: string | null;
  price?: number | null;
  companyId: number;
  createdBy: string;
}

export default Product;

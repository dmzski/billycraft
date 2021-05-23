import { LineTypeEnum } from "./LineTypeEnum";

export class Product {
  id?: number;
  description = "";
  price: number | string = 0;
  type: LineTypeEnum = LineTypeEnum.ARTICLE;
  keywords = "";
}

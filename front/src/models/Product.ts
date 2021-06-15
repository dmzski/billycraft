import { LineTypeEnum } from "./LineTypeEnum";

export class Product {
  id?: number;
  name = "";
  description = "";
  price: number | string = 0;
  type: LineTypeEnum = LineTypeEnum.ARTICLE;
  keywords: string[] = [];
}

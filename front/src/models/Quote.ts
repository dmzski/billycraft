import { Customer } from "./Customer";
import { LineTypeEnum } from "./LineTypeEnum";
import { QuoteStatusEnum } from "./QuoteStatusEnum";

export class Quote {
  id?: string;
  title: string = "";
  customer: Customer = new Customer();
  tva: number = 0;
  createdAt?: string;
  updatedAt?: string;
  status: QuoteStatusEnum = QuoteStatusEnum.DRAFT;
  lines: QuoteLine[] = [];
  total?: number;
}

export class QuoteLine {
  id?: string;
  description: string = "";
  quantity: number = 0;
  price: number = 0;
  line: number = 0;
  type: LineTypeEnum = LineTypeEnum.SERVICE;
}

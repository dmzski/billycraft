import { Customer } from "./Customer";
import { LineTypeEnum } from "./LineTypeEnum";
import { QuoteStatusEnum } from "./QuoteStatusEnum";

export class Quote {
  id?: string;
  title = "";
  customer: Customer = new Customer();
  tva = 0;
  createdAt?: string;
  updatedAt?: string;
  sentAt?: string;
  status: QuoteStatusEnum = QuoteStatusEnum.DRAFT;
  lines: QuoteLine[] = [];
  total?: number;
}

export class QuoteLine {
  id?: string;
  description = "";
  quantity = 0;
  price = 0;
  line = 0;
  type: LineTypeEnum = LineTypeEnum.SERVICE;
}

import { Customer } from "./Customer";
import { BillStatusEnum } from "./BillStatusEnum";
import { LineTypeEnum } from "./LineTypeEnum";

export class Bill {
  id?: string;
  title = "";
  customer: Customer = new Customer();
  tva = 0;
  createdAt?: string;
  updatedAt?: string;
  sentAt?: string;
  status: BillStatusEnum = BillStatusEnum.DRAFT;
  lines: BillLine[] = [];
  total?: number;
  quoteId?: string;
}

export class BillLine {
  id?: string;
  type: LineTypeEnum = LineTypeEnum.SERVICE;
  description = "";
  quantity = 0;
  price = 0;
  line = 0;
}

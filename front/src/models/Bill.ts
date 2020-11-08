import { Customer } from "./Customer";
import { BillStatusEnum } from "./BillStatusEnum";

export class Bill {
  id?: string;
  title: string = "";
  customer: Customer = new Customer();
  tva: number = 0;
  createdAt?: string;
  updatedAt?: string;
  status: BillStatusEnum = BillStatusEnum.DRAFT;
  lines: BillLine[] = [];
  total?: number;
  quoteId?: string;
}

export class BillLine {
  id?: string;
  description: string = "";
  quantity: number = 0;
  price: number = 0;
  line: number = 0;
}

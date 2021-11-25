import { LineTypeEnum } from "./LineTypeEnum";

export enum BillStatusEnum {
  DRAFT = "DRAFT",
  SENT = "SENT",
  ACCEPTED = "ACCEPTED",
  REFUSED = "REFUSED",
  PAYMENT_PAID = "PAID",
  ARCHIVED = "ARCHIVED",
}

interface Bill {
  id: string;
  title: string;
  tva: number;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  status: BillStatusEnum;
  createdBy: string;
  companyId: number;
  customerId: number;
  fileName: null;
  lines: BillLine[];
  quoteId: string;
}

export interface BillLine {
  billId: string;
  line: number;
  quantity: number;
  price: number;
  name: string;
  description: string;
  type: LineTypeEnum;
}

export default Bill;

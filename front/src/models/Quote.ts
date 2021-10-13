import { LineTypeEnum } from "./LineTypeEnum";

interface Quote {
  id: string;
  title: string;
  tva: number;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  status: QuoteStatusEnum;
  createdBy: string;
  companyId: number;
  customerId: number;
  fileName?: string;
  lines: QuoteLine[];
}

export interface QuoteLine {
  quoteId: string;
  line: number;
  quantity: number;
  price: number;
  name: string;
  description: string;
  type: LineTypeEnum;
}

export enum QuoteStatusEnum {
  DRAFT = "DRAFT",
  SENT = "SENT",
  ACCEPTED = "ACCEPTED",
  REFUSED = "REFUSED",
  DEPOSIT_ASK = "DEPOSIT_ASK",
  DEPOSIT_PAID = "DEPOSIT_PAID",
  ARCHIVED = "ARCHIVED",
}

export default Quote;

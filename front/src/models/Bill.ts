import type { ProductType } from "./LineTypeEnum";

export type BillStatus =
	| "DRAFT"
	| "SENT"
	| "ACCEPTED"
	| "REFUSED"
	| "TO_DECLARE"
	| "ARCHIVED";

export const BILL_STATUS: BillStatus[] = [
	"DRAFT",
	"SENT",
	"ACCEPTED",
	"REFUSED",
	"TO_DECLARE",
	"ARCHIVED",
];

export type BillLine = {
	billId: string;
	line: number;
	quantity: number | null;
	price: number | null;
	name: string;
	description: string | null;
	type: ProductType;
	productId: string | null;
};

type Bill = {
	id: string;
	name: string;
	title: string;
	tva: number;
	createdAt: string;
	updatedAt: string;
	sentAt?: string;
	paidAt?: string;
	status: BillStatus;
	createdBy: string;
	companyId: string;
	customerId: string;
	fileName?: string;
	lines: BillLine[];
	quoteId: string;
};

export default Bill;

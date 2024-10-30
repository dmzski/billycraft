import { ProductType } from "./LineTypeEnum";

export type QuoteStatus =
	| "DRAFT"
	| "SENT"
	| "ACCEPTED"
	| "REFUSED"
	| "DEPOSIT_ASK"
	| "ARCHIVED";

export const QUOTE_STATUS: QuoteStatus[] = [
	"DRAFT",
	"SENT",
	"ACCEPTED",
	"REFUSED",
	"DEPOSIT_ASK",
	"ARCHIVED",
];

export type QuoteLine = {
	quoteId: string;
	line: number;
	quantity: number | null;
	price: number | null;
	name: string;
	description: string | null;
	type: ProductType;
	productId: string | null;
};

type Quote = {
	id: string;
	name: string;
	title: string;
	tva: number;
	createdAt: string;
	updatedAt: string;
	sentAt?: string;
	status: QuoteStatus;
	createdBy: string;
	companyId: string;
	customerId: string;
	fileName?: string;
	lines: QuoteLine[];
};

export default Quote;

import { ProductType } from "../LineTypeEnum";
import { QuoteStatus } from "../Quote";

export type QuoteCreateRequestLine = {
	line: number;
	quantity: number | null;
	price: number | null;
	name: string;
	description: string | null;
	type: ProductType;
	productId: string | null;
};

export type QuoteCreateRequest = {
	lines: QuoteCreateRequestLine[];
	tva: number;
	title: string;
	customerId: string;
	status?: QuoteStatus;
};

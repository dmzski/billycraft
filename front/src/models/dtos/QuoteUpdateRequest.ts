import { ProductType } from "../LineTypeEnum";
import { QuoteStatus } from "../Quote";

export type QuoteUpdateRequestLine = {
	line: number;
	quantity: number | null;
	price: number | null;
	name: string;
	description: string | null;
	type: ProductType;
	productId: string | null;
};

export type QuoteUpdateRequest = {
	id: string;
	lines: QuoteUpdateRequestLine[];
	tva: number;
	title: string;
	customerId: string;
	status?: QuoteStatus;
};

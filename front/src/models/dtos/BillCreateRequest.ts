import { ProductType } from "../LineTypeEnum";
import { BillStatus } from "../Bill";

export type BillCreateRequestLine = {
	line: number;
	quantity?: number | null;
	price?: number | null;
	name: string;
	description?: string | null;
	type: ProductType;
	productId?: string | null;
};

export type BillCreateRequest = {
	lines: BillCreateRequestLine[];
	tva: number;
	title: string;
	customerId: string;
	status?: BillStatus;
};

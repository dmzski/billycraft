import { BillLine } from "@/models/Bill";

export type BillFormValues = {
	lines: Array<BillLine & { itPrice: number }>;
	tva: number;
	title: string;
	customerId: string;
};

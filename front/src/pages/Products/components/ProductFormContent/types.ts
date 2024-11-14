import type { ProductType } from "@/sdk";

export type ProductFormValues = {
	type: ProductType;
	name: string;
	description?: string | null;
	price?: number | null;
	itPrice: number;
	supplierId?: string | null;
	groupId?: string | null;
	stock?: number | null;
	code?: string | null;
	lowStock?: number | null;
	stockAlert: boolean;
};

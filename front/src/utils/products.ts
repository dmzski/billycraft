import type { ProductResponse } from "@/sdk";
import { isUndefinedOrNull } from "./isUndefinedOrNull";

export type ProductFilters = Record<
	"type" | "name" | "supplierId" | "groupId",
	string
> & { lowStockOnly: boolean; noStockOnly: boolean };

export const filterProducts = (
	products: ProductResponse[],
	filter: ProductFilters,
) => {
	let filtered = products;
	if (filter.type) {
		filtered = filtered.filter(({ type }) => type === filter.type);
	}
	if (filter.supplierId) {
		filtered = filtered.filter(
			({ supplierId }) => supplierId === filter.supplierId,
		);
	}
	if (filter.groupId) {
		filtered = filtered.filter(({ groupId }) => groupId === filter.groupId);
	}
	if (filter.name) {
		filtered = filtered.filter(({ name }) =>
			name.toLowerCase().includes(filter.name.toLowerCase()),
		);
	}
	if (filter.noStockOnly) {
		filtered = filtered.filter(
			({ stock, stockAlert }) =>
				stockAlert && !isUndefinedOrNull(stock) && stock === 0,
		);
	}
	if (filter.lowStockOnly) {
		filtered = filtered.filter(
			({ stock, stockAlert, lowStock }) =>
				stockAlert &&
				!isUndefinedOrNull(lowStock) &&
				!isUndefinedOrNull(stock) &&
				stock <= lowStock,
		);
	}

	return filtered;
};

import Bill from "@/models/Bill";
import Customer from "@/models/Customer";
import Quote from "@/models/Quote";
import { formatISO9075, parseJSON } from "date-fns";

type FilterKey = "name" | "status" | "createdAt" | "title" | "customer";

export function filterBillsOrQuotes<T extends Quote | Bill>(
	array: T[],
	filters: Record<FilterKey, string>,
	customers: Customer[],
): T[] {
	if (!array) return [];
	if (!filters) return array;
	const arrayFiltered = [...array];
	return arrayFiltered.filter((item: T) => {
		let takeIt = true;
		const customer = customers.find((c) => c.id === item.customerId);
		if (
			filters.name &&
			!item.name.trim().includes(filters.name.toUpperCase().trim())
		) {
			takeIt = false;
		}
		if (
			filters.status &&
			filters.status !== "all" &&
			item.status !== filters.status
		) {
			takeIt = false;
		}
		if (
			filters.customer &&
			!customer?.name
				.toLowerCase()
				.trim()
				.includes(filters.customer.toLowerCase().trim())
		) {
			takeIt = false;
		}
		if (
			filters.title &&
			!item.title
				?.toLowerCase()
				.trim()
				.includes(filters.title.toLowerCase().trim())
		) {
			takeIt = false;
		}

		if (
			filters.createdAt &&
			item.createdAt &&
			!formatISO9075(parseJSON(item.createdAt)).includes(filters.createdAt)
		) {
			takeIt = false;
		}
		return takeIt;
	});
}

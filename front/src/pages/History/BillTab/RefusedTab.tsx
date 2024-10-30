import Loader from "@/components/Loader";
import useCustomers from "@/hooks/useCustomers";
import BillFilterContainer from "@/pages/Bills/Filters";
import BillTable from "@/pages/Bills/List";
import { useState, useMemo } from "react";
import { useAllBillsRefusedQuery } from "@/queries/useAllBillsRefusedQuery";
import { filterBillsOrQuotes } from "@/utils/filters";

const RefusedTab = () => {
	const customers = useCustomers();
	const [filters, setFilters] = useState<
		Parameters<typeof filterBillsOrQuotes>[1]
	>({
		name: "",
		customer: "",
		createdAt: "",
		title: "",
		status: "",
	});
	const { data, isLoading } = useAllBillsRefusedQuery();

	const billSorted = useMemo(
		() => filterBillsOrQuotes(data ?? [], filters, customers),
		[customers, data, filters],
	);

	return (
		<>
			<div>
				<BillFilterContainer filters={filters} setFilters={setFilters} />
			</div>
			<BillTable page="refused" data={billSorted} />
			{isLoading && !data ? (
				<div className="flex justify-center">
					<Loader />
				</div>
			) : null}
		</>
	);
};

export default RefusedTab;

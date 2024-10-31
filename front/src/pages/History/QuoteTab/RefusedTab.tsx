import Loader from "@/components/Loader";
import useCustomers from "@/hooks/useCustomers";
import QuoteFilterContainer from "@/pages/Quotes/Filters";
import QuoteList from "@/pages/Quotes/List/List";
import { useMemo, useState } from "react";
import { useAllQuotesRefusedQuery } from "@/queries/useAllQuotesRefusedQuery";
import { filterBillsOrQuotes } from "@/utils/filters";

const HistoryTab = () => {
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

	const { data, isLoading, reload } = useAllQuotesRefusedQuery();
	const quoteSorted = useMemo(
		() => filterBillsOrQuotes(data ?? [], filters, customers),
		[data, filters, customers],
	);
	return (
		<>
			<div>
				<QuoteFilterContainer filters={filters} setFilters={setFilters} />
			</div>
			<QuoteList page="refused" reload={reload} data={quoteSorted} />
			{isLoading && !data ? (
				<div className="mt-2 flex justify-center">
					<Loader />
				</div>
			) : null}
		</>
	);
};

export default HistoryTab;

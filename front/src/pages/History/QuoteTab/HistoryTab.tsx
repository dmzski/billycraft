import Loader from "@/components/Loader";
import useCustomers from "@/hooks/useCustomers";
import QuoteFilterContainer from "@/pages/Quotes/Filters";
import QuoteList from "@/pages/Quotes/List/List";
import { useMemo, useState } from "react";
import { useAllQuotesArchivedQuery } from "@/queries/useAllQuotesArchivedQuery";
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

	const { data, isLoading } = useAllQuotesArchivedQuery();
	const quoteSorted = useMemo(
		() => filterBillsOrQuotes(data ?? [], filters, customers),
		[customers, filters, data],
	);
	return (
		<>
			<div>
				<QuoteFilterContainer filters={filters} setFilters={setFilters} />
			</div>
			<QuoteList page="archived" data={quoteSorted} />
			{isLoading && !data ? (
				<div className="flex justify-center">
					<Loader />
				</div>
			) : null}
		</>
	);
};

export default HistoryTab;

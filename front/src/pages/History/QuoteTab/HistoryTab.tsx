import Loader from "@/components/Loader";
import useCustomers from "@/hooks/useCustomers";
import QuoteFilterContainer from "@/pages/Quotes/Filters";
import QuoteList from "@/pages/Quotes/List/List";
import { useMemo, useState } from "react";
import { filterQuotes } from "@/utils/quote";
import { useAllQuotesArchivedQuery } from "@/queries/useAllQuotesArchivedQuery";

type QuoteFilters = Record<string, string>;
const HistoryTab = () => {
	const customers = useCustomers();
	const [filters, setFilters] = useState<QuoteFilters>({});

	const { data, isLoading } = useAllQuotesArchivedQuery();
	const quoteSorted = useMemo(
		() => filterQuotes(data ?? [], filters, customers),
		[customers, filters, data],
	);
	return (
		<>
			<QuoteFilterContainer
				disabledFilters={["status"]}
				filters={filters}
				setFilters={setFilters}
			/>
			<QuoteList page="archived" data={quoteSorted} />
			{isLoading && !data ? (
				<div className="mt-2 flex justify-center">
					<Loader />
				</div>
			) : null}
		</>
	);
};

export default HistoryTab;

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Loader, Tabs } from "@coco-ui/core";
import { ROUTES } from "@/routes";
import useCustomers from "@/hooks/useCustomers";
import QuoteFilterContainer from "./Filters";
import QuoteList from "./List/List";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useI18n } from "@/i18n";
import { useAllQuotesNotArchivedAndNotRefused } from "@/queries/useAllQuotesNotArchivedAndNotRefused";
import { filterBillsOrQuotes } from "@/utils/filters";
import { QUOTE_STATUS, QuoteStatus } from "@/models/Quote";

const QuotePage = () => {
	const { t } = useI18n();
	const customers = useCustomers();
	const [selectedStatus, setSelectedStatus] = useState<"all" | QuoteStatus>(
		"all",
	);
	const [filters, setFilters] = useState<
		Parameters<typeof filterBillsOrQuotes>[1]
	>({
		name: "",
		customer: "",
		createdAt: "",
		status: "",
		title: "",
	});

	const { isLoading, data } = useAllQuotesNotArchivedAndNotRefused();

	const quoteSorted = useMemo(
		() =>
			filterBillsOrQuotes(
				data ?? [],
				{ ...filters, status: selectedStatus },
				customers,
			),
		[customers, filters, data, selectedStatus],
	);

	return (
		<div className="flex flex-col gap-8">
			<div className="flex justify-between">
				<h2 className="text-3xl">Devis</h2>
				<Button asChild>
					<Link to={ROUTES.QUOTE_ADD.path()}>
						<PlusIcon />
						{t("quotes.list.add")}
					</Link>
				</Button>
			</div>
			<div className="overflow-x-auto">
				<Tabs>
					<Tabs.Tab
						isActive={selectedStatus === "all"}
						onClick={() => setSelectedStatus("all")}
					>
						{t("all")}
					</Tabs.Tab>
					{QUOTE_STATUS.map((status) => (
						<Tabs.Tab
							onClick={() => setSelectedStatus(status)}
							isActive={status === selectedStatus}
						>
							{t(`quotes.status.${status}`)}
						</Tabs.Tab>
					))}
				</Tabs>
			</div>
			<div>
				<QuoteFilterContainer filters={filters} setFilters={setFilters} />
			</div>
			<QuoteList data={quoteSorted} />
			{isLoading && !data ? (
				<div className="mt-2 flex justify-center">
					<Loader />
				</div>
			) : null}
		</div>
	);
};

export default QuotePage;

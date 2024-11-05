import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Loader, Tabs } from "@coco-ui/core";
import { QuoteRouteQueryParams, ROUTES } from "@/routes";
import useCustomers from "@/hooks/useCustomers";
import QuoteFilterContainer from "./Filters";
import QuoteList from "./List/List";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useI18n } from "@/i18n";
import { filterBillsOrQuotes } from "@/utils/filters";
import { QUOTE_STATUS } from "@/models/Quote";
import { useAllQuotesQuery } from "@/queries/useAllQuotesQuery";
import { useQueryParams } from "@/hooks/useQueryParams";

const QuotePage = () => {
	const { t } = useI18n();
	const customers = useCustomers();
	const { tab } = useQueryParams<QuoteRouteQueryParams>();
	const [selectedStatus, setSelectedStatus] = useState<
		QuoteRouteQueryParams["tab"]
	>(tab && tab !== "all" && QUOTE_STATUS.includes(tab) ? tab : "all");
	const [filters, setFilters] = useState<
		Parameters<typeof filterBillsOrQuotes>[1]
	>({
		name: "",
		customer: "",
		createdAt: "",
		status: "",
		title: "",
	});

	const { isLoading, data, reload } = useAllQuotesQuery();

	const quoteSorted = useMemo(
		() =>
			filterBillsOrQuotes(
				data ?? [],
				{ ...filters, status: selectedStatus ?? "all" },
				customers,
			),
		[customers, filters, data, selectedStatus],
	);

	return (
		<div className="flex flex-col gap-8">
			<div className="flex justify-between">
				<h2 className="text-3xl font-semibold">Devis</h2>
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
              key={status}
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
			<QuoteList
				selectedStatus={selectedStatus}
				data={quoteSorted}
				reload={reload}
			/>
			{isLoading && !data ? (
				<div className="mt-2 flex justify-center">
					<Loader />
				</div>
			) : null}
		</div>
	);
};

export default QuotePage;

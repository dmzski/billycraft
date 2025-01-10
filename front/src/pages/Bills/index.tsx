import { useMemo, useState } from "react";
import { Button, Loader, Tabs } from "@billycraft/ui";
import useCustomers from "@/hooks/useCustomers";
import { Link } from "react-router-dom";
import { type BillRouteQueryParams, ROUTES } from "@/routes";
import BillFilterContainer from "./Filters";
import BillTable from "./List";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useI18n } from "@/i18n";
import { filterBillsOrQuotes } from "@/utils/filters";
import { useAllBillsQuery } from "@/queries/useAllBillsQuery";
import { useQueryParams } from "@/hooks/useQueryParams";
import { BillStatusSchema } from "@/sdk";

const BillPage = () => {
	const customers = useCustomers();
	const { tab } = useQueryParams<BillRouteQueryParams>();
	const [selectedStatus, setSelectedStatus] = useState<
		BillRouteQueryParams["tab"]
	>(tab && tab !== "all" && BillStatusSchema.enum.includes(tab) ? tab : "all");

	const [filters, setFilters] = useState<
		Parameters<typeof filterBillsOrQuotes>[1]
	>({
		name: "",
		title: "",
		status: "",
		customer: "",
		createdAt: "",
	});
	const { data, isLoading } = useAllBillsQuery();
	const { t } = useI18n();

	const billSorted = useMemo(
		() =>
			filterBillsOrQuotes(
				data ?? [],
				{ ...filters, status: selectedStatus ?? "all" },
				customers,
			),
		[customers, data, filters, selectedStatus],
	);

	return (
		<div className="flex flex-col gap-8">
			<div className="flex justify-between">
				<h1 className="text-3xl">{t("bills.list.title")}</h1>
				<Button asChild>
					<Link to={ROUTES.BILLS.routes.ADD.path()}>
						<PlusIcon />
						<span>{t("bills.list.add")}</span>
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
					{BillStatusSchema.enum.map((status) => (
						<Tabs.Tab
							key={status}
							onClick={() => setSelectedStatus(status)}
							isActive={status === selectedStatus}
						>
							{t(`bills.status.${status}`)}
						</Tabs.Tab>
					))}
				</Tabs>
			</div>
			<div>
				<BillFilterContainer filters={filters} setFilters={setFilters} />
			</div>
			<BillTable selectedStatus={selectedStatus} data={billSorted} />
			{isLoading ? (
				<div className="mt-2 flex justify-center">
					<Loader />
				</div>
			) : null}
		</div>
	);
};

export default BillPage;

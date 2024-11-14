import useCustomers from "@/hooks/useCustomers";
import type { BillResponse } from "@/sdk";
import BillTableLine from "./Row";
import { useI18n } from "@/i18n";
import type { BillOverviewRouteQueryParams } from "@/routes";
import { useEffect, useRef, useState } from "react";
import { BottomActionBar } from "@/components/BottomActionBar";
import { MultiDownloadPdfModal } from "../modals/MultiDownloadPdfModal";
import { Button, Checkbox } from "@billycraft/ui";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/solid";

type BillListProps = {
	data: BillResponse[];
	selectedStatus?: BillOverviewRouteQueryParams["fromTab"];
};

const BillList = ({ data, selectedStatus }: BillListProps) => {
	const { t } = useI18n();
	const customers = useCustomers();
	const containerRef = useRef<HTMLDivElement>(null);
	const [selected, setSelected] = useState<BillResponse[]>([]);

	useEffect(() => {
		if (data) {
			setSelected([]);
		}
	}, [data]);

	return (
		<div className="flex flex-col gap-2">
			{data.length > 0 ? (
				<div className="p-4">
					<Checkbox
						name="select-all"
						checked={
							selected.length > 0
								? selected.length < data.length
									? "indeterminate"
									: "checked"
								: "unchecked"
						}
						onCheckedChange={(newState) => {
							setSelected(() => (newState ? [...data] : []));
						}}
						value="all"
						label={t("selectAll")}
					/>
				</div>
			) : null}
			<div className="px-4 grid md:grid-cols-4 text-muted-foreground text-sm gap-4">
				<div className="md:pl-20">{t("bills.list.headers.reference")}</div>
				<div>{t("bills.list.headers.customer")}</div>
				<div>{t("bills.list.headers.createdAt")}</div>
				<div>{t("bills.list.headers.status")}</div>
			</div>
			<div ref={containerRef} className="flex flex-col gap-2">
				{data.map((bill) => (
					<BillTableLine
						customer={customers.find((c) => c.id === bill.customerId)}
						key={bill.id}
						bill={bill}
						selectedStatus={selectedStatus}
						checked={!!selected.find(({ id }) => id === bill.id)}
						onCheckedChange={(newState) => {
							if (newState) {
								setSelected((current) => [...current, bill]);
							} else {
								setSelected((current) =>
									current.filter(({ id }) => id !== bill.id),
								);
							}
						}}
					/>
				))}
			</div>
			{selected.length > 0 ? (
				<BottomActionBar containerRef={containerRef}>
					<div className="flex justify-between items-center gap-4">
						<span className="font-bold">
							{selected?.length}&nbsp;
							{t(selected?.length > 1 ? "itemSelectedPlural" : "itemSelected")}
						</span>
						<div className="flex gap-2">
							<MultiDownloadPdfModal
								billIds={selected.map(({ id }) => id)}
								disclosure={
									<Button size="icon">
										<ArrowDownOnSquareIcon />
									</Button>
								}
							/>
						</div>
					</div>
				</BottomActionBar>
			) : null}
		</div>
	);
};

export default BillList;

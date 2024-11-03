import { Button, Collapsible, Dropdown, useToast } from "@coco-ui/core";
import { BillApi } from "@/api/BillApi";
import { formatISO9075, parseJSON } from "date-fns";
import Bill, { BillStatus } from "@/models/Bill";
import Customer from "@/models/Customer";
import { useMemo, MouseEvent, useReducer } from "react";
import { BillOverviewRouteQueryParams, ROUTES } from "@/routes";
import { useI18n } from "@/i18n";
import { BillLabel } from "@/components/labels/BillLabel";
import { RowContent } from "./RowContent";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useAllBillsQuery } from "@/queries/useAllBillsQuery";

type BillTableLineProps = {
	bill: Bill;
	customer?: Customer;
	selectedStatus: BillOverviewRouteQueryParams["fromTab"];
};
const BillTableLine = ({
	bill,
	customer,
	selectedStatus,
}: BillTableLineProps) => {
	const [open, toggleOpen] = useReducer((state) => !state, false);
	const { reload } = useAllBillsQuery({ enabled: false });
	const toast = useToast();
	const { t } = useI18n();

	const updateBillStatus = (status: BillStatus) => (e: MouseEvent) => {
		e.stopPropagation();
		const updateStatus = async () => {
			try {
				if (bill.id) await BillApi.updateStatus({ id: bill.id, status });
				toast.show(t("bills.list.statusUpdated"));
				reload();
			} catch {
				toast.destructive(t("genericFormError"));
			}
		};
		updateStatus();
	};

	const nextStatuses: BillStatus[] = useMemo(() => {
		switch (bill.status) {
			case "SENT":
				return ["REFUSED", "TO_DECLARE", "ARCHIVED"];
			case "TO_DECLARE":
				return ["ARCHIVED"];
			case "ARCHIVED":
			case "REFUSED":
				return [];
			default:
				return ["SENT", "ARCHIVED"];
		}
	}, [bill]);

	return (
		<div className="border rounded-md">
			<Collapsible
				open={open}
				disclosure={
					<div className="grid md:grid-cols-4 items-center md:h-16 p-2 gap-4">
						<div className="flex items-center gap-4">
							<Button onClick={toggleOpen} size="icon" variant="ghost">
								{open ? <ChevronUpIcon /> : <ChevronDownIcon />}
							</Button>
							<BillLabel
								bill={bill}
								to={ROUTES.BILL_OVERVIEW.path(
									{ id: bill.id },
									{ fromTab: selectedStatus },
								)}
							/>
						</div>
						<div className="truncate">{customer?.name ?? "-"}</div>
						<div>{formatISO9075(parseJSON(bill.createdAt))}</div>
						<div>
							{nextStatuses.length > 0 ? (
								<Dropdown
									disclosure={
										<Button>{t(`bills.status.${bill.status}`)}</Button>
									}
								>
									<Dropdown.Content>
										{nextStatuses.map((s) => (
											<Dropdown.Button key={s} onClick={updateBillStatus(s)}>
												{t(`bills.status.${s}`)}
											</Dropdown.Button>
										))}
									</Dropdown.Content>
								</Dropdown>
							) : (
								<p>{t(`bills.status.${bill.status}`)}</p>
							)}
						</div>
					</div>
				}
			>
				<RowContent bill={bill} />
			</Collapsible>
		</div>
	);
};

export default BillTableLine;

import {
	Button,
	Checkbox,
	Collapsible,
	Dropdown,
	useToast,
} from "@billycraft/ui";
import { BillApi } from "@/api/BillApi";
import { formatISO9075, parseJSON } from "date-fns";
import type Bill from "@/models/Bill";
import type { BillStatus } from "@/models/Bill";
import type Customer from "@/models/Customer";
import { useMemo, type MouseEvent, useReducer } from "react";
import { type BillOverviewRouteQueryParams, ROUTES } from "@/routes";
import { useI18n } from "@/i18n";
import { BillLabel } from "@/components/labels/BillLabel";
import { RowContent } from "./RowContent";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useAllBillsQuery } from "@/queries/useAllBillsQuery";

type BillTableLineProps = {
	bill: Bill;
	customer?: Customer;
	selectedStatus: BillOverviewRouteQueryParams["fromTab"];
	checked: boolean;
	onCheckedChange: (newState: boolean) => void;
};
const BillTableLine = ({
	bill,
	customer,
	selectedStatus,
	checked,
	onCheckedChange,
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
				return ["REFUSED", "ARCHIVED"];
			case "TO_DECLARE":
				return ["ARCHIVED"];
			case "ARCHIVED":
			case "REFUSED":
				return [];
			default:
				return ["SENT"];
		}
	}, [bill.status]);

	return (
		<div className="border rounded-md">
			<Collapsible
				open={open}
				disclosure={
					<div className="grid md:grid-cols-4 items-center md:h-16 px-4 py-2 gap-4">
						<div className="flex items-center gap-4">
							<div className="flex flex-col items-center md:flex-row gap-2">
								<Checkbox
									name={bill.name}
									checked={checked}
									onCheckedChange={onCheckedChange}
								/>
								<Button onClick={toggleOpen} size="icon" variant="ghost">
									{open ? <ChevronUpIcon /> : <ChevronDownIcon />}
								</Button>
							</div>
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

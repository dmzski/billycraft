import { Button, Dropdown, useToast } from "@coco-ui/core";
import { BillApi } from "@/api/BillApi";
import { formatISO9075, parseJSON } from "date-fns";
import Bill, { BillStatus } from "@/models/Bill";
import Customer from "@/models/Customer";
import { useMemo, MouseEvent } from "react";
import { ROUTES } from "@/routes";
import { useI18n } from "@/i18n";
import { useAllBillsNotArchivedAndNotRefused } from "@/queries/useAllBillsNotArchivedAndNotRefused";
import { RRLink } from "@/components/RRLink";

type BillTableLineProps = {
	bill: Bill;
	customer?: Customer;
	page?: "list" | "archived" | "refused";
};
const BillTableLine = ({ bill, customer, page }: BillTableLineProps) => {
	const { reload } = useAllBillsNotArchivedAndNotRefused({ enabled: false });
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

	// Prio info numero + nom du client + date reste dans le depliant
	return (
		<div className="grid md:grid-cols-12 px-4 py-2 items-center border-b md:h-16">
			<div className="md:col-span-1 text-sm">
				<RRLink to={ROUTES.BILL_OVERVIEW.path({ id: bill.id }, { from: page })}>
					{bill.name}
				</RRLink>
			</div>
			<div className="md:col-span-3 truncate">{bill.title}</div>
			<div className="md:col-span-2 truncate">{customer?.name ?? "-"}</div>
			<div className="md:col-span-2">
				{formatISO9075(parseJSON(bill.createdAt))}
			</div>
			<div className="md:col-span-2">
				{bill.updatedAt ? formatISO9075(parseJSON(bill.updatedAt)) : "-"}
			</div>
			<div className="md:col-span-2">
				{nextStatuses.length > 0 ? (
					<Dropdown
						disclosure={<Button>{t(`bills.status.${bill.status}`)}</Button>}
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
	);
};

export default BillTableLine;

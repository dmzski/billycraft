import { BillApi } from "@/api/BillApi";
import { useI18n } from "@/i18n";
import Bill, { BillStatus } from "@/models/Bill";
import { Button, useToast } from "@coco-ui/core";
import {
	CheckIcon,
	EnvelopeIcon,
	InboxArrowDownIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

type ActionsProps = {
	bill: Bill;
	reloadBill: () => Promise<void>;
};

export const Actions = ({ bill, reloadBill }: ActionsProps) => {
	const { t } = useI18n();
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const updateBillStatus = (status: BillStatus) => async () => {
		setIsSubmitting(true);
		try {
			if (bill) {
				await BillApi.updateStatus({ id: bill.id, status });
				toast.show(t("bills.form.submit.edit.success"));
				await reloadBill();
			}
		} catch {
			toast.destructive(t("genericFormError"));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="flex md:flex-row flex-col gap-4 justify-end">
			{bill.status === "DRAFT" ? (
				<Button
					type="button"
					onClick={updateBillStatus("SENT")}
					disabled={isSubmitting}
					className="gap-4 md:col-start-2"
				>
					<EnvelopeIcon />
					{t("bills.form.actions.sent")}
				</Button>
			) : null}
			{bill.status === "SENT" ? (
				<>
					<Button
						type="button"
						onClick={updateBillStatus("REFUSED")}
						variant="destructive"
						disabled={isSubmitting}
					>
						<XMarkIcon />
						{t("bills.form.actions.refused")}
					</Button>
					<Button
						disabled={isSubmitting}
						type="button"
						onClick={updateBillStatus("TO_DECLARE")}
					>
						<CheckIcon />
						{t("bills.form.actions.toDeclare")}
					</Button>
				</>
			) : null}
			{bill.status === "TO_DECLARE" ? (
				<Button
					disabled={isSubmitting}
					className="gap-4 md:col-start-2"
					type="button"
					onClick={updateBillStatus("ARCHIVED")}
					variant="destructive"
				>
					<InboxArrowDownIcon />
					{t("bills.form.actions.archive")}
				</Button>
			) : null}
		</section>
	);
};

import { useI18n } from "@/i18n";
import { type BillResponse, BillsService, type BillStatus } from "@/sdk";
import { Button, useToast } from "@billycraft/ui";
import {
	EnvelopeIcon,
	InboxArrowDownIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

type ActionsProps = {
	bill: BillResponse;
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
				await BillsService.patchBillsById({
					path: { id: bill.id },
					body: {
						status,
						lines: bill.lines,
						title: bill.title,
					},
				});
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
						className="gap-4 md:col-start-2"
						type="button"
						onClick={updateBillStatus("ARCHIVED")}
					>
						<InboxArrowDownIcon />
						{t("bills.form.actions.archive")}
					</Button>
				</>
			) : null}
		</section>
	);
};

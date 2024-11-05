import { QuoteApi } from "@/api/QuoteApi";
import { useI18n } from "@/i18n";
import Quote, { QuoteStatus } from "@/models/Quote";
import { Button, useToast } from "@coco-ui/core";
import {
	CheckIcon,
	EnvelopeIcon,
	InboxArrowDownIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

type ActionsProps = {
	quote: Quote;
	reloadQuote: () => Promise<void>;
};

export const Actions = ({ quote, reloadQuote }: ActionsProps) => {
	const { t } = useI18n();
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const updateQuoteStatus = (status: QuoteStatus) => async () => {
		setIsSubmitting(true);
		try {
			if (quote) {
				await QuoteApi.updateStatus({ id: quote.id, status });
				toast.show(t("quotes.form.submit.edit.success"));
				await reloadQuote();
			}
		} catch {
			toast.destructive(t("genericFormError"));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="flex flex-col md:flex-row gap-4 justify-end">
			{quote.id && quote.status === "DRAFT" ? (
				<Button
					type="button"
					onClick={updateQuoteStatus("SENT")}
					disabled={isSubmitting}
					className="md:col-start-2"
				>
					<EnvelopeIcon />
					{t("quotes.form.actions.sent")}
				</Button>
			) : null}
			{quote.status === "SENT" ? (
				<>
					<Button
						type="button"
						onClick={updateQuoteStatus("REFUSED")}
						variant="outline"
						disabled={isSubmitting}
					>
						<XMarkIcon />
						{t("quotes.form.actions.refused")}
					</Button>
					<Button
						disabled={isSubmitting}
						type="button"
						onClick={updateQuoteStatus("ACCEPTED")}
					>
						<CheckIcon />
						{t("quotes.form.actions.accepted")}
					</Button>
				</>
			) : null}
			{quote.status === "REFUSED" ? (
				<>
					<Button
						disabled={isSubmitting}
						type="button"
						onClick={updateQuoteStatus("DRAFT")}
						variant="outline"
					>
						{t("quotes.form.actions.backToDraft")}
					</Button>
					<Button
						disabled={isSubmitting}
						type="button"
						variant="destructive"
						onClick={updateQuoteStatus("ARCHIVED")}
					>
						<InboxArrowDownIcon />
						{t("quotes.form.actions.archive")}
					</Button>
				</>
			) : null}
			{quote.status === "ACCEPTED" ? (
				<>
					<Button
						disabled={isSubmitting}
						type="button"
						variant="destructive"
						onClick={updateQuoteStatus("ARCHIVED")}
					>
						<InboxArrowDownIcon />
						{t("quotes.form.actions.archive")}
					</Button>
					<Button
						disabled={isSubmitting}
						type="button"
						onClick={updateQuoteStatus("DEPOSIT_ASK")}
					>
						{t("quotes.form.actions.depositAsk")}
					</Button>
				</>
			) : null}
			{quote.status === "DEPOSIT_ASK" ? (
				<Button
					disabled={isSubmitting}
					className="md:col-start-2"
					type="button"
					onClick={updateQuoteStatus("ARCHIVED")}
					variant="destructive"
				>
					<InboxArrowDownIcon />
					{t("quotes.form.actions.archive")}
				</Button>
			) : null}
		</section>
	);
};

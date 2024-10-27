import { QuoteApi } from "@/api/QuoteApi";
import { useI18n } from "@/i18n";
import Quote, { QuoteStatusEnum } from "@/models/Quote";
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

	const updateQuoteStatus = (status: QuoteStatusEnum) => async () => {
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
		<section className="grid md:grid-cols-2 gap-4 justify-end">
			{quote.id && quote.status === QuoteStatusEnum.DRAFT ? (
				<Button
					type="button"
					onClick={updateQuoteStatus(QuoteStatusEnum.SENT)}
					disabled={isSubmitting}
					className="md:col-start-2"
				>
					<EnvelopeIcon />
					{t("quotes.form.actions.sent")}
				</Button>
			) : null}
			{quote.status === QuoteStatusEnum.SENT ? (
				<>
					<Button
						type="button"
						onClick={updateQuoteStatus(QuoteStatusEnum.REFUSED)}
						variant="outline"
						disabled={isSubmitting}
					>
						<XMarkIcon />
						{t("quotes.form.actions.refused")}
					</Button>
					<Button
						disabled={isSubmitting}
						type="button"
						onClick={updateQuoteStatus(QuoteStatusEnum.ACCEPTED)}
					>
						<CheckIcon />
						{t("quotes.form.actions.accepted")}
					</Button>
				</>
			) : null}
			{quote.status === QuoteStatusEnum.REFUSED ? (
				<>
					<Button
						disabled={isSubmitting}
						type="button"
						onClick={updateQuoteStatus(QuoteStatusEnum.DRAFT)}
						variant="outline"
					>
						{t("quotes.form.actions.backToDraft")}
					</Button>
					<Button
						disabled={isSubmitting}
						type="button"
						variant="destructive"
						onClick={updateQuoteStatus(QuoteStatusEnum.ARCHIVED)}
					>
						<InboxArrowDownIcon />
						{t("quotes.form.actions.archive")}
					</Button>
				</>
			) : null}
			{quote.status === QuoteStatusEnum.ACCEPTED ? (
				<>
					<Button
						disabled={isSubmitting}
						type="button"
						variant="destructive"
						onClick={updateQuoteStatus(QuoteStatusEnum.ARCHIVED)}
					>
						<InboxArrowDownIcon />
						{t("quotes.form.actions.archive")}
					</Button>
					<Button
						disabled={isSubmitting}
						type="button"
						onClick={updateQuoteStatus(QuoteStatusEnum.DEPOSIT_ASK)}
					>
						{t("quotes.form.actions.depositAsk")}
					</Button>
				</>
			) : null}
			{quote.status === QuoteStatusEnum.DEPOSIT_ASK ? (
				<Button
					disabled={isSubmitting}
					className="md:col-start-2"
					type="button"
					onClick={updateQuoteStatus(QuoteStatusEnum.ARCHIVED)}
					variant="destructive"
				>
					<InboxArrowDownIcon />
					{t("quotes.form.actions.archive")}
				</Button>
			) : null}
		</section>
	);
};

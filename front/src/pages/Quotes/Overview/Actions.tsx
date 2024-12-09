import { QuoteStatusIcon } from "@/components/QuoteStatusIcon";
import { useI18n } from "@/i18n";
import { type QuoteResponse, QuotesService, type QuoteStatus } from "@/sdk";
import { Button, useToast } from "@billycraft/ui";
import { useState } from "react";

type ActionsProps = {
	quote: QuoteResponse;
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
				await QuotesService.patchQuotesById({
					path: { id: quote.id },
					body: { ...quote, status },
				});
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
					<QuoteStatusIcon status="SENT" />
					{t("quotes.form.actions.sent")}
				</Button>
			) : null}
			{quote.status === "SENT" ? (
				<>
					<Button
						type="button"
						onClick={updateQuoteStatus("REFUSED")}
						variant="destructive"
						disabled={isSubmitting}
					>
						<QuoteStatusIcon status="REFUSED" />
						{t("quotes.form.actions.refused")}
					</Button>
					<Button
						disabled={isSubmitting}
						type="button"
						onClick={updateQuoteStatus("ACCEPTED")}
					>
						<QuoteStatusIcon status="ACCEPTED" />
						{t("quotes.form.actions.accepted")}
					</Button>
				</>
			) : null}
			{quote.status === "ACCEPTED" ? (
				<Button
					disabled={isSubmitting}
					type="button"
					onClick={updateQuoteStatus("ARCHIVED")}
				>
					<QuoteStatusIcon status="ARCHIVED" />
					{t("quotes.form.actions.archive")}
				</Button>
			) : null}
		</section>
	);
};

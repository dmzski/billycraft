import { Button, Dropdown, useToast } from "@coco-ui/core";
import { QuoteApi } from "@/api/QuoteApi";
import { formatISO9075, parseJSON } from "date-fns";
import Customer from "@/models/Customer";
import Quote, { QuoteStatus } from "@/models/Quote";
import { MouseEvent, useMemo } from "react";
import { ROUTES } from "@/routes";
import { useI18n } from "@/i18n";
import { useAllQuotesNotArchivedAndNotRefused } from "@/queries/useAllQuotesNotArchivedAndNotRefused";
import { RRLink } from "@/components/RRLink";

type QuoteTableLineProps = {
	quote: Quote;
	customer?: Customer;
	page?: "list" | "archived" | "refused";
};
const QuoteTableLine = ({ quote, customer, page }: QuoteTableLineProps) => {
	const { t } = useI18n();
	const { reload } = useAllQuotesNotArchivedAndNotRefused({ enabled: false });
	const toast = useToast();

	const updateQuoteStatus =
		(status: QuoteStatus) => (e: MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			const updateStatus = async () => {
				try {
					if (quote.id) await QuoteApi.updateStatus({ id: quote.id, status });
					toast.show(t("quotes.list.statusUpdated"));
					reload();
				} catch {
					toast.destructive(t("genericFormError"));
				}
			};
			updateStatus();
		};

	const nextStatuses = useMemo<QuoteStatus[]>(() => {
		switch (quote.status) {
			case "SENT":
				return ["ACCEPTED", "REFUSED", "DEPOSIT_ASK", "ARCHIVED"];
			case "REFUSED":
				return ["DRAFT", "ARCHIVED"];
			case "ACCEPTED":
				return ["DEPOSIT_ASK", "ARCHIVED"];
			case "DEPOSIT_ASK":
				return ["ARCHIVED"];
			case "ARCHIVED":
				return [];
			default:
				return [
					"DRAFT",
					"SENT",
					"DEPOSIT_ASK",
					"ACCEPTED",
					"REFUSED",
					"ARCHIVED",
				];
		}
	}, [quote]);

	return (
		<div className="grid md:grid-cols-12 px-4 py-2 items-center border-b md:h-16">
			<div className="md:col-span-1 text-sm">
				<RRLink
					to={ROUTES.QUOTE_OVERVIEW.path(
						{ id: quote.id },
						page !== undefined ? { from: page } : undefined,
					)}
				>
					{quote.name}
				</RRLink>
			</div>
			<div className="md:col-span-3 truncate">{quote.title}</div>
			<div className="md:col-span-2 truncate">{customer?.name ?? "-"}</div>
			<div className="md:col-span-2">
				{quote.createdAt ? formatISO9075(parseJSON(quote.createdAt)) : ""}
			</div>
			<div className="md:col-span-2">
				{quote.updatedAt ? formatISO9075(parseJSON(quote.updatedAt)) : "-"}
			</div>
			<div className="md:col-span-2">
				{nextStatuses.length > 0 ? (
					<Dropdown
						disclosure={<Button>{t(`quotes.status.${quote.status}`)}</Button>}
					>
						<Dropdown.Content>
							{nextStatuses.map((s) => (
								<Dropdown.Button key={s} onClick={updateQuoteStatus(s)}>
									{t(`quotes.status.${s}`)}
								</Dropdown.Button>
							))}
						</Dropdown.Content>
					</Dropdown>
				) : (
					<p>{t(`quotes.status.${quote.status}`)}</p>
				)}
			</div>
		</div>
	);
};

export default QuoteTableLine;

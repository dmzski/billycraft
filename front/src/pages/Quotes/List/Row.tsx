import { Button, Collapsible, Dropdown, useToast } from "@coco-ui/core";
import { QuoteApi } from "@/api/QuoteApi";
import { formatISO9075, parseJSON } from "date-fns";
import Customer from "@/models/Customer";
import Quote, { QuoteStatus } from "@/models/Quote";
import { MouseEvent, useMemo, useReducer } from "react";
import { QuoteRouteQueryParams, ROUTES } from "@/routes";
import { useI18n } from "@/i18n";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { QuoteLabel } from "@/components/labels/QuoteLabel";
import { RowContent } from "./RowContent";

type QuoteTableLineProps = {
	quote: Quote;
	customer?: Customer;
  reload: () => Promise<void>
  selectedStatus: QuoteRouteQueryParams['tab']
};
const QuoteTableLine = ({ quote, customer, selectedStatus, reload }: QuoteTableLineProps) => {
	const { t } = useI18n();
  const [open, toggleOpen] = useReducer(state => !state, false)
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
		<div className="border rounded-md">
			<Collapsible
				open={open}
				disclosure={
					<div className="grid md:grid-cols-4 items-center md:h-16 p-2 gap-4">
						<div className="flex items-center gap-4">
              <Button onClick={toggleOpen} size="icon" variant="ghost">
                {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </Button>
							<QuoteLabel
								quote={quote}
								to={ROUTES.QUOTE_OVERVIEW.path({ id: quote.id }, { fromTab: selectedStatus })}
							/>
						</div>
						<div className="truncate">{customer?.name ?? "-"}</div>
						<div>{formatISO9075(parseJSON(quote.createdAt))}</div>
						<div>
							{nextStatuses.length > 0 ? (
								<Dropdown
									disclosure={
										<Button>{t(`quotes.status.${quote.status}`)}</Button>
									}
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
				}
			>
				<RowContent quote={quote} />
			</Collapsible>
		</div>
	);
};

export default QuoteTableLine;

import { Button, Collapsible, Dropdown, useToast } from "@billycraft/ui";
import { formatISO9075, parseJSON } from "date-fns";
import { type MouseEvent, useMemo, useReducer } from "react";
import { type QuoteRouteQueryParams, ROUTES } from "@/routes";
import { useI18n } from "@/i18n";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { QuoteLabel } from "@/components/labels/QuoteLabel";
import { RowContent } from "./RowContent";
import {
	QuotesService,
	type CustomerResponse,
	type QuoteResponse,
	type QuoteStatus,
} from "@/sdk";

type QuoteTableLineProps = {
	quote: QuoteResponse;
	customer?: CustomerResponse;
	reload: () => Promise<void>;
	selectedStatus: QuoteRouteQueryParams["tab"];
};
const QuoteTableLine = ({
	quote,
	customer,
	selectedStatus,
	reload,
}: QuoteTableLineProps) => {
	const { t } = useI18n();
	const [open, toggleOpen] = useReducer((state) => !state, false);
	const toast = useToast();

	const updateQuoteStatus =
		(status: QuoteStatus) => (e: MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			const updateStatus = async () => {
				try {
					if (quote.id)
						await QuotesService.patchQuotesById({
							path: { id: quote.id },
							body: { ...quote, status },
						});
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
				return ["ACCEPTED", "REFUSED", "ARCHIVED"];
			case "ACCEPTED":
				return ["ARCHIVED"];
			case "REFUSED":
			case "ARCHIVED":
				return [];
			default:
				return ["SENT"];
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
								to={ROUTES.QUOTES.routes.OVERVIEW.path(
									{ id: quote.id },
									{ fromTab: selectedStatus },
								)}
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
				<RowContent quote={quote} customer={customer} />
			</Collapsible>
		</div>
	);
};

export default QuoteTableLine;

import { useI18n } from "@/i18n";
import { useQuoteByIdQuery } from "@/queries/useQuoteByIdQuery";
import {
	type QuoteOverviewRouteQueryParams,
	type QuoteRouteProps,
	ROUTES,
} from "@/routes";
import { isQuoteMinimumAccepted } from "@/utils/quote";
import { Alert, Button, Loader, useToast } from "@billycraft/ui";
import {
	ChevronLeftIcon,
	DocumentArrowDownIcon,
	PencilIcon,
	PlusIcon,
} from "@heroicons/react/24/solid";
import { Link, useHistory, useParams } from "react-router-dom";
import { Actions } from "./Actions";
import { useReducer } from "react";
import { useQueryParams } from "@/hooks/useQueryParams";
import { RRLink } from "@/components/RRLink";
import { QuoteLabel } from "@/components/labels/QuoteLabel";
import { InformationSection } from "./InformationSection";
import { ContentSection } from "./ContentSection";
import { PdfsService, QuotesService } from "@/sdk";
import { sendErrorToSentry } from "@/utils/errors";

export const Overview = () => {
	const { t, scopedT } = useI18n();
	const toast = useToast();
	const { id } = useParams<QuoteRouteProps>();
	const { fromTab } = useQueryParams<QuoteOverviewRouteQueryParams>();
	const { data: quote, isLoading, reload } = useQuoteByIdQuery(id);
	const { push } = useHistory();
	const [isDownloadingPDF, toggleIsDownloadingPDF] = useReducer(
		(state) => !state,
		false,
	);
	const [isDuplicating, toggleIsDuplicating] = useReducer(
		(state) => !state,
		false,
	);
	const [isCreatingBill, toggleIsCreatingBill] = useReducer(
		(state) => !state,
		false,
	);

	const pageT = scopedT("quotes.details");

	const downloadPdf = async () => {
		try {
			if (quote?.id && !isDownloadingPDF) {
				toggleIsDownloadingPDF();
				const blob = await PdfsService.getPdfsQuoteById({
					path: { id: quote.id },
				}).then(({ data }) => data);
				if (!blob) {
					throw new Error("Unreadable PDF object");
				}
				const link = document.createElement("a");
				link.download = quote.name;
				link.href = URL.createObjectURL(blob);
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				toggleIsDownloadingPDF();
			}
		} catch {
			toast.destructive(t("quotes.form.pdfError"));
			toggleIsDownloadingPDF();
		}
	};

	const createBill = async () => {
		if (quote && !isCreatingBill) {
			try {
				toggleIsCreatingBill();
				const data = await QuotesService.postQuotesByIdBill({
					path: { id: quote.id },
				}).then(({ data }) => data);
				toast.show(t("quotes.details.createBillSuccess"));
				if (data?.id) {
					push(ROUTES.BILL_OVERVIEW.path({ id: data.id }));
				} else {
					push(ROUTES.BILLS.path());
				}
			} catch {
				toast.destructive(t("quotes.form.createBillError"));
				toggleIsCreatingBill();
			}
		}
	};

	const duplicate = async () => {
		if (quote?.id && !isDuplicating) {
			toggleIsDuplicating();
			try {
				const newQuote = await QuotesService.postQuotesByIdDuplicate({
					path: { id: quote.id },
				}).then(({ data }) => data);
				toast.show(t("quotes.details.duplicateSuccess"));
				push(
					newQuote?.id
						? ROUTES.QUOTE_OVERVIEW.path({ id: newQuote.id })
						: ROUTES.QUOTES.path(),
				);
			} catch (error) {
				sendErrorToSentry(error);
				toast.destructive(t("quotes.details.duplicateError"));
			} finally {
				toggleIsDuplicating();
			}
		}
	};

	if (!quote && isLoading) {
		return (
			<div className="flex items-center jusitfy-center">
				<Loader />
			</div>
		);
	}

	if (!quote) {
		return <Alert variant="destructive">{t("genericDataLoadError")}</Alert>;
	}

	return (
		<div className="flex flex-col gap-12">
			<RRLink
				to={ROUTES.QUOTES.path({ tab: fromTab })}
				className="inline-flex items-center gap-1"
			>
				<ChevronLeftIcon className="size-4" />
				{pageT("backTo")}
			</RRLink>
			<div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
				<div>
					<QuoteLabel quote={quote} size="lg" />
				</div>
				<div className="flex gap-4 md:flex-row flex-col">
					<Button
						disabled={isDownloadingPDF}
						onClick={downloadPdf}
						variant="secondary"
					>
						<DocumentArrowDownIcon />
						{t("quotes.details.downloadPdfButton")}
					</Button>
					{quote.status === "DRAFT" ? (
						<Button asChild>
							<Link to={ROUTES.QUOTE_EDIT.path({ id: quote.id })}>
								<PencilIcon />
								<span>{t("edit")}</span>
							</Link>
						</Button>
					) : (
						<div className="flex gap-4 md:flex-row flex-col">
							<Button
                variant="outline"
								onClick={duplicate}
								disabled={
									(quote.status !== "REFUSED" && quote.status !== "ARCHIVED") || isDuplicating
								}
							>
								{t("quotes.details.duplicate")}
							</Button>
              <Button
                onClick={createBill}
                disabled={isCreatingBill || !isQuoteMinimumAccepted(quote)}
              >
                <PlusIcon />
                {t("quotes.details.createBill")}
              </Button>
						</div>
					)}
				</div>
			</div>
			<InformationSection quote={quote} />
			<ContentSection quote={quote} />
			<Actions quote={quote} reloadQuote={reload} />
		</div>
	);
};

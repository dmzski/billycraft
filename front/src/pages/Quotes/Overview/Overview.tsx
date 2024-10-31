import { useI18n } from "@/i18n";
import { useQuoteByIdQuery } from "@/queries/useQuoteByIdQuery";
import { QuoteRouteProps, QuoteRouteQueryParams, ROUTES } from "@/routes";
import { isQuoteMinimumAccepted } from "@/utils/quote";
import { Alert, Button, Loader, useToast } from "@coco-ui/core";
import {
	ChevronLeftIcon,
	DocumentArrowDownIcon,
	PencilIcon,
	PlusIcon,
} from "@heroicons/react/24/solid";
import { Link, useHistory, useParams } from "react-router-dom";
import { Actions } from "./Actions";
import { PdfApi } from "@/api/PdfApi";
import { QuoteApi } from "@/api/QuoteApi";
import { useMemo, useReducer } from "react";
import { useQueryParams } from "@/hooks/useQueryParams";
import { RRLink } from "@/components/RRLink";
import { QuoteLabel } from "@/components/labels/QuoteLabel";
import { InformationSection } from "./InformationSection";
import { ContentSection } from "./ContentSection";

export const Overview = () => {
	const { t, scopedT } = useI18n();
	const toast = useToast();
	const { id } = useParams<QuoteRouteProps>();
	const { from } = useQueryParams<QuoteRouteQueryParams>();
	const { data: quote, isLoading, reload } = useQuoteByIdQuery(id);
	const { push } = useHistory();
	const [isDownloadingPDF, toggleIsDownloadingPDF] = useReducer(
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
				const blob = await PdfApi.getQuotePdf(quote.id);
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
				const data = await QuoteApi.createBill({ id: quote.id });
				toast.show(t("quotes.form.createBill"));
				if (data.id) {
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

	const backLink = useMemo(() => {
		if (from === "refused") {
			return ROUTES.HISTORY.routes.QUOTES.routes.REFUSED.path();
		}
		if (from === "archived") {
			return ROUTES.HISTORY.routes.QUOTES.routes.ARCHIVED.path();
		}

		return ROUTES.QUOTES.path();
	}, [from]);

	if (!quote && isLoading) {
		return (
			<div className="flex items-center jusitfy-center">
				<Loader size="lg" />
			</div>
		);
	}

	if (!quote) {
		return <Alert variant="destructive">{t("genericDataLoadError")}</Alert>;
	}

	return (
		<div className="flex flex-col gap-12">
			<RRLink to={backLink} className="inline-flex items-center gap-1">
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
            {t("quotes.form.downloadPdfButton")}
          </Button>
					{quote.status === "DRAFT" ? (
						<Button asChild>
							<Link to={ROUTES.QUOTE_EDIT.path({ id: quote.id })}>
								<PencilIcon />
								<span>{t("edit")}</span>
							</Link>
						</Button>
					) : null}
          <Button
            onClick={createBill}
            disabled={isCreatingBill || !isQuoteMinimumAccepted(quote)}
          >
            <PlusIcon />
            {t("quotes.form.createBill")}
          </Button>
				</div>
			</div>
			<InformationSection quote={quote} />
			<ContentSection quote={quote} />
			<Actions quote={quote} reloadQuote={reload} />
		</div>
	);
};

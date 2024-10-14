import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useI18n } from "@/i18n";
import { LineTypeEnum } from "@/models/LineTypeEnum";
import { useCustomerQuery } from "@/queries/useCustomerQuery";
import { useQuoteByIdQuery } from "@/queries/useQuoteByIdQuery";
import { QuoteRouteProps, QuoteRouteQueryParams, ROUTES } from "@/routes";
import {
	getQuoteTotal,
	getQuoteTotalET,
	getQuoteTotalETForLineType,
	getQuoteTotalForLineType,
	isQuoteMinimumAccepted,
} from "@/utils/quote";
import { Alert, Button, Loader, useToast } from "@coco-ui/core";
import {
	ChevronLeftIcon,
	DocumentArrowDownIcon,
	DocumentIcon,
	PencilIcon,
	PlusIcon,
} from "@heroicons/react/24/solid";
import { Link, useHistory, useParams } from "react-router-dom";
import { Actions } from "./Actions";
import { PdfApi } from "@/api/PdfApi";
import { QuoteApi } from "@/api/QuoteApi";
import { calculatePriceTTC } from "@/utils/price";
import { QuoteStatusEnum } from "@/models/Quote";
import { useReducer } from "react";
import { useQueryParams } from "@/hooks/useQueryParams";

export const Overview = () => {
	const { t, scopedT } = useI18n();
	const toast = useToast();
	const { id } = useParams<QuoteRouteProps>();
	const { from } = useQueryParams<QuoteRouteQueryParams>();
	const { data: quote, isLoading, reload } = useQuoteByIdQuery(id);
	const { data: customer } = useCustomerQuery(quote?.customerId ?? "", {
		enabled: !!quote?.customerId,
	});
	const { push } = useHistory();
	const formatCurrency = useFormatCurrency();
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
			toast.error(t("quotes.form.pdfError"));
			toggleIsDownloadingPDF();
		}
	};

	const createBill = async () => {
		if (quote && !isCreatingBill) {
			try {
				toggleIsCreatingBill();
				const data = await QuoteApi.createBill({ id: quote.id });
				toast.success(t("quotes.form.createBill"));
				if (data.id) {
					push(ROUTES.BILL_OVERVIEW.path({ id: data.id }));
				} else {
					push(ROUTES.BILLS.path());
				}
			} catch {
				toast.error(t("quotes.form.createBillError"));
				toggleIsCreatingBill();
			}
		}
	};

	if (!quote && isLoading) {
		return (
			<div className="flex items-center jusitfy-center">
				<Loader size="lg" />
			</div>
		);
	}

	if (!quote) {
		return <Alert variant="error">{t("genericDataLoadError")}</Alert>;
	}

	return (
		<div className="flex flex-col gap-10">
			<Link
				to={
					from === "archived"
						? ROUTES.HISTORY.routes.QUOTES.routes.ARCHIVED.path()
						: ROUTES.QUOTES.path()
				}
				className="link link-primary inline-flex items-center gap-1"
			>
				<ChevronLeftIcon className="w-5" />
				{pageT("backTo")}
			</Link>
			<div className="flex flex-col md:flex-row gap-5 md:justify-between md:items-center">
				<h1 className="text-4xl font-bold flex gap-5 items-center">
					<DocumentIcon className="w-14 p-3 text-primary bg-primary-content mask mask-squircle" />
					<span>{quote.name}</span>
				</h1>
				{quote.status === QuoteStatusEnum.DRAFT ? (
					<Link
						to={ROUTES.QUOTE_EDIT.path({ id: quote.id })}
						className="btn btn-primary gap-2"
					>
						<PencilIcon className="w-5" />
						<span>{t("edit")}</span>
					</Link>
				) : null}
			</div>
			<section className="flex flex-col gap-5">
				<h2 className="text-2xl">{pageT("sections.information.title")}</h2>
				<div className="grid md:grid-cols-4 border rounded-2xl items-center divide-x *:p-4">
					<dl>
						<dt className="font-bold">{pageT("sections.information.id")}</dt>
						<dd>{quote.name}</dd>
					</dl>
					<dl>
						<dt className="font-bold">
							{pageT("sections.information.status")}
						</dt>
						<dd>{t(`quotes.status.${quote.status}`)}</dd>
					</dl>
					<dl>
						<dt className="font-bold">
							{pageT("sections.information.customer")}
						</dt>
						<dd>
							{customer ? (
								<Link
									className="link-hover link-primary"
									to={ROUTES.CUSTOMER_OVERVIEW.path({
										id: customer.id.toString(),
									})}
								>
									{customer.name ?? "-"}
								</Link>
							) : (
								"-"
							)}
						</dd>
					</dl>
					<dl>
						<dt className="font-bold">{pageT("sections.information.vat")}</dt>
						<dd>{quote.tva}&nbsp;%</dd>
					</dl>
				</div>
				<div className="stats stats-vertical lg:stats-horizontal border grid md:grid-cols-4">
					<dl className="stat">
						<dt className="stat-title">
							{pageT("sections.information.total")}
						</dt>
						<dd className="stat-value">
							{formatCurrency(getQuoteTotal(quote))}
						</dd>
						<dd className="stat-desc">
							{formatCurrency(getQuoteTotalET(quote))}&nbsp;
							{t("shortExcludedTax")}
						</dd>
					</dl>
					<dl className="stat">
						<dt className="stat-title">
							{pageT("sections.information.totalProducts")}
						</dt>
						<dd className="stat-value">
							{formatCurrency(
								getQuoteTotalForLineType(quote, LineTypeEnum.ARTICLE),
							)}
						</dd>
						<dd className="stat-desc">
							{formatCurrency(
								getQuoteTotalETForLineType(quote, LineTypeEnum.ARTICLE),
							)}
							&nbsp;
							{t("shortExcludedTax")}
						</dd>
					</dl>
					<dl className="stat">
						<dt className="stat-title">
							{pageT("sections.information.totalServices")}
						</dt>
						<dd className="stat-value">
							{formatCurrency(
								getQuoteTotalForLineType(quote, LineTypeEnum.SERVICE),
							)}
						</dd>
						<dd className="stat-desc">
							{formatCurrency(
								getQuoteTotalETForLineType(quote, LineTypeEnum.SERVICE),
							)}
							&nbsp;
							{t("shortExcludedTax")}
						</dd>
					</dl>
					<dl className="stat">
						<dt className="stat-title">
							{pageT("sections.information.totalOthers")}
						</dt>
						<dd className="stat-value">
							{formatCurrency(
								getQuoteTotalForLineType(quote, LineTypeEnum.OTHER_SERVICE),
							)}
						</dd>
						<dd className="stat-desc">
							{formatCurrency(
								getQuoteTotalETForLineType(quote, LineTypeEnum.OTHER_SERVICE),
							)}
							&nbsp;
							{t("shortExcludedTax")}
						</dd>
					</dl>
				</div>
			</section>
			<hr />
			<section className="flex flex-col gap-5">
				<h2 className="text-2xl">{pageT("sections.content.title")}</h2>
				<div className="grid md:grid-cols-2 gap-5">
					<Button
						variant="primary"
						outline
						size="md"
						onClick={createBill}
						disabled={isCreatingBill || !isQuoteMinimumAccepted(quote)}
						className="gap-4"
					>
						<PlusIcon className="w-5" />
						{t("quotes.form.createBill")}
					</Button>
					<Button
						disabled={isDownloadingPDF}
						onClick={downloadPdf}
						variant="default"
						size="md"
						className="gap-1"
					>
						<DocumentArrowDownIcon className="w-5" />
						{t("quotes.form.downloadPdfButton")}
					</Button>
				</div>
				<div className="flex flex-col gap-5">
					<dl>
						<dt className="font-bold">{pageT("sections.content.name")}</dt>
						<dd>{quote.title}</dd>
					</dl>
					<div className="flex flex-col border">
						<div className="bg-primary-content text-primary grid md:grid-cols-12 gap-2 p-4">
							<div className="md:col-span-8">
								{pageT("sections.content.headers.name")}
							</div>
							<div>{pageT("sections.content.headers.quantity")}</div>
							<div>{pageT("sections.content.headers.etPrice")}</div>
							<div>{pageT("sections.content.headers.itPrice")}</div>
							<div>{pageT("sections.content.headers.subItTotal")}</div>
						</div>
						{quote.lines.map(
							({ line, name, price, quantity, description, type }) => (
								<div
									key={line}
									className="px-4 py-2 grid md:grid-cols-12 gap-2 even:bg-base-200"
								>
									<div className="md:col-span-8 flex flex-col">
										<p className="font-bolder">{name}</p>
										<p className="pl-4 opacity-70 whitespace-pre-wrap">
											{description}
										</p>
									</div>
									{type !== LineTypeEnum.TEXT ? (
										<>
											<div>{quantity}</div>
											<div>{formatCurrency(price ?? 0)}</div>
											<div>
												{formatCurrency(calculatePriceTTC(price, quote.tva))}
											</div>
											<div>
												{formatCurrency(
													calculatePriceTTC(price, quote.tva) * (quantity ?? 0),
												)}
											</div>
										</>
									) : null}
								</div>
							),
						)}
					</div>
					<div className="grid md:grid-cols-12 grid *:p-2">
						<p className="md:col-start-10 border-b bg-primary-content text-primary">
							{t("etTotal")}
						</p>
						<p className="md:col-span-2 flex items-center border">
							{formatCurrency(getQuoteTotalET(quote))}
						</p>
						<p className="md:col-start-10 border-b bg-primary-content text-primary">
							{t("vat")}
						</p>
						<p className="md:col-span-2 flex items-center border border-b-0 border-t-0">
							{formatCurrency(getQuoteTotal(quote) - getQuoteTotalET(quote))}
						</p>
						<p className="md:col-start-10 border-b bg-primary-content text-primary">
							{t("itTotal")}
						</p>
						<p className="md:col-span-2 flex items-center border">
							{formatCurrency(getQuoteTotal(quote))}
						</p>
					</div>
				</div>
			</section>
			<Actions quote={quote} reloadQuote={reload} />
		</div>
	);
};

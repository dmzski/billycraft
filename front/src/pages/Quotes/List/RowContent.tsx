import { RRLink } from "@/components/RRLink"
import { useFormatCurrency } from "@/hooks/useFormatCurrency"
import { useI18n } from "@/i18n"
import { ROUTES } from "@/routes"
import type { CustomerResponse, QuoteResponse } from "@/sdk"
import {
	getBillOrQuoteTotal,
	getBillOrQuoteTotalETForLineType,
	getBillOrQuoteTotalEt,
	getBillOrQuoteTotalForLineType,
} from "@/utils/price"

type RowContentProps = {
	quote: QuoteResponse
	customer?: CustomerResponse
}

export const RowContent = ({ quote, customer }: RowContentProps) => {
	const { t, scopedT } = useI18n()
	const pageT = scopedT("quotes.details")
	const formatCurrency = useFormatCurrency()

	return (
		<div className="border-t">
			<div className="flex flex-col gap-4 p-4">
				<div className="grid md:grid-cols-4 items-center gap-4">
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
								<RRLink
									to={ROUTES.CUSTOMERS.routes.OVERVIEW.path({
										id: customer.id.toString(),
									})}
								>
									{customer.name ?? "-"}
								</RRLink>
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
				<div className="grid md:grid-cols-4 gap-4">
					<dl>
						<dt className="font-semibold">
							{pageT("sections.information.total")}
						</dt>
						<dd>{formatCurrency(getBillOrQuoteTotal(quote))}</dd>
						<dd className="text-muted-foreground text-xs">
							{formatCurrency(getBillOrQuoteTotalEt(quote))}&nbsp;
							{t("shortExcludedTax")}
						</dd>
					</dl>
					<dl>
						<dt className="font-semibold">
							{pageT("sections.information.totalProducts")}
						</dt>
						<dd>
							{formatCurrency(getBillOrQuoteTotalForLineType(quote, "ARTICLE"))}
						</dd>
						<dd className="text-xs text-muted-foreground">
							{formatCurrency(
								getBillOrQuoteTotalETForLineType(quote, "ARTICLE"),
							)}
							&nbsp;
							{t("shortExcludedTax")}
						</dd>
					</dl>
					<dl>
						<dt className="font-semibold">
							{pageT("sections.information.totalServices")}
						</dt>
						<dd>
							{formatCurrency(getBillOrQuoteTotalForLineType(quote, "SERVICE"))}
						</dd>
						<dd className="text-xs text-muted-foreground">
							{formatCurrency(
								getBillOrQuoteTotalETForLineType(quote, "SERVICE"),
							)}
							&nbsp;
							{t("shortExcludedTax")}
						</dd>
					</dl>
					<dl>
						<dt className="font-semibold">
							{pageT("sections.information.totalOthers")}
						</dt>
						<dd>
							{formatCurrency(
								getBillOrQuoteTotalForLineType(quote, "OTHER_SERVICE"),
							)}
						</dd>
						<dd className="text-muted-foreground text-xs">
							{formatCurrency(
								getBillOrQuoteTotalETForLineType(quote, "OTHER_SERVICE"),
							)}
							&nbsp;
							{t("shortExcludedTax")}
						</dd>
					</dl>
				</div>
			</div>
		</div>
	)
}

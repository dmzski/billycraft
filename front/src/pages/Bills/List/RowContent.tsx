import { RRLink } from "@/components/RRLink";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useI18n } from "@/i18n";
import Bill from "@/models/Bill";
import { useCustomerQuery } from "@/queries/useCustomerQuery";
import { ROUTES } from "@/routes";
import {
	getBillOrQuoteTotal,
	getBillOrQuoteTotalETForLineType,
	getBillOrQuoteTotalEt,
	getBillOrQuoteTotalForLineType,
} from "@/utils/price";

type RowContentProps = {
	bill: Bill;
};

export const RowContent = ({ bill }: RowContentProps) => {
	const { t, scopedT } = useI18n();
	const pageT = scopedT("bills.details");
	const formatCurrency = useFormatCurrency();
	const { data: customer } = useCustomerQuery(bill?.customerId ?? "", {
		enabled: !!bill?.customerId,
	});
	return (
		<div className="border-t">
			<div className="flex flex-col gap-4 p-4">
				<div className="grid md:grid-cols-4 items-center gap-4">
					<dl>
						<dt className="font-bold">{pageT("sections.information.id")}</dt>
						<dd>{bill.name}</dd>
					</dl>
					<dl>
						<dt className="font-bold">
							{pageT("sections.information.status")}
						</dt>
						<dd>{t(`bills.status.${bill.status}`)}</dd>
					</dl>
					<dl>
						<dt className="font-bold">
							{pageT("sections.information.customer")}
						</dt>
						<dd>
							{customer ? (
								<RRLink
									to={ROUTES.CUSTOMER_OVERVIEW.path({
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
						<dd>{bill.tva}&nbsp;%</dd>
					</dl>
				</div>
				<div className="grid md:grid-cols-4 gap-4">
					<dl>
						<dt className="font-semibold">
							{pageT("sections.information.total")}
						</dt>
						<dd>
							{formatCurrency(getBillOrQuoteTotalEt(bill))}
						</dd>
						<dd className="text-muted-foreground text-xs">
							{formatCurrency(getBillOrQuoteTotal(bill))}&nbsp;
							{t("shortIncludedTax")}
						</dd>
					</dl>
					<dl>
						<dt className="font-semibold">
							{pageT("sections.information.totalProducts")}
						</dt>
						<dd>
							{formatCurrency(
								getBillOrQuoteTotalETForLineType(bill, "ARTICLE"),
							)}
						</dd>
						<dd className="text-xs text-muted-foreground">
							{formatCurrency(getBillOrQuoteTotalForLineType(bill, "ARTICLE"))}
							&nbsp;
							{t("shortIncludedTax")}
						</dd>
					</dl>
					<dl>
						<dt className="font-semibold">
							{pageT("sections.information.totalServices")}
						</dt>
						<dd>
							{formatCurrency(
								getBillOrQuoteTotalETForLineType(bill, "SERVICE"),
							)}
						</dd>
						<dd className="text-xs text-muted-foreground">
							{formatCurrency(getBillOrQuoteTotalForLineType(bill, "SERVICE"))}
							&nbsp;
							{t("shortIncludedTax")}
						</dd>
					</dl>
					<dl>
						<dt className="font-semibold">
							{pageT("sections.information.totalOthers")}
						</dt>
						<dd>
							{formatCurrency(
								getBillOrQuoteTotalETForLineType(bill, "OTHER_SERVICE"),
							)}
						</dd>
						<dd className="text-muted-foreground text-xs">
							{formatCurrency(
								getBillOrQuoteTotalForLineType(bill, "OTHER_SERVICE"),
							)}
							&nbsp;
							{t("shortIncludedTax")}
						</dd>
					</dl>
				</div>
			</div>
		</div>
	);
};

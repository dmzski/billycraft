import { RRLink } from "@/components/RRLink";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useFormatDate } from "@/hooks/useFormatDate";
import { useI18n } from "@/i18n";
import type Bill from "@/models/Bill";
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
	const { toISO9075 } = useFormatDate();
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
					<dl>
						<dt className="font-bold">
							{pageT("sections.information.creationDate")}
						</dt>
						<dd>{toISO9075(bill.createdAt)}</dd>
					</dl>
					<dl>
						<dt className="font-bold">
							{pageT("sections.information.sentAt")}
						</dt>
						<dd>{bill.sentAt ? toISO9075(bill.sentAt) : "-"}</dd>
					</dl>
					<dl>
						<dt className="font-bold">
							{pageT("sections.information.paidAt")}
						</dt>
						<dd>{bill.paidAt ? toISO9075(bill.paidAt) : "-"}</dd>
					</dl>
				</div>
				<div className="grid md:grid-cols-4 gap-4">
					<dl>
						<dt className="font-semibold">
							{pageT("sections.information.total")}
						</dt>
						<dd>{formatCurrency(getBillOrQuoteTotal(bill))}</dd>
						<dd className="text-muted-foreground text-xs">
							{formatCurrency(getBillOrQuoteTotalEt(bill))}&nbsp;
							{t("shortExcludedTax")}
						</dd>
					</dl>
					<dl>
						<dt className="font-semibold">
							{pageT("sections.information.totalProducts")}
						</dt>
						<dd>
							{formatCurrency(getBillOrQuoteTotalForLineType(bill, "ARTICLE"))}
						</dd>
						<dd className="text-xs text-muted-foreground">
							{formatCurrency(
								getBillOrQuoteTotalETForLineType(bill, "ARTICLE"),
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
							{formatCurrency(getBillOrQuoteTotalForLineType(bill, "SERVICE"))}
						</dd>
						<dd className="text-xs text-muted-foreground">
							{formatCurrency(
								getBillOrQuoteTotalETForLineType(bill, "SERVICE"),
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
								getBillOrQuoteTotalForLineType(bill, "OTHER_SERVICE"),
							)}
						</dd>
						<dd className="text-muted-foreground text-xs">
							{formatCurrency(
								getBillOrQuoteTotalETForLineType(bill, "OTHER_SERVICE"),
							)}
							&nbsp;
							{t("shortExcludedTax")}
						</dd>
					</dl>
				</div>
			</div>
		</div>
	);
};

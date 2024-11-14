import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useI18n } from "@/i18n";
import { useAllBillsNotPaidQuery } from "@/queries/useAllBillsNotPaidQuery";
import { ROUTES } from "@/routes";
import { getBillOrQuoteTotal } from "@/utils/price";
import { Badge, Button, Loader } from "@billycraft/ui";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export const BillsOverdueSection = () => {
	const { t } = useI18n();
	const formatCurrency = useFormatCurrency();
	const { data: notPaid, isLoading } = useAllBillsNotPaidQuery();

	const totalNotPaid =
		notPaid && Array.isArray(notPaid)
			? notPaid.reduce((acc, bill) => acc + getBillOrQuoteTotal(bill), 0)
			: 0;

	return (
		<section className="flex flex-col gap-4 border rounded-md p-4 justify-between">
			<div className="flex justify-between items-center">
				<h2 className="flex text-xl gap-2 items-center flex-grow font-semibold">
					<CurrencyDollarIcon className="size-6" />
					{t("dashboard.notPaidBills.title")}
				</h2>
				<div>
					<Badge variant={notPaid?.length ? "default" : "outline"}>
						{notPaid?.length} {t("dashboard.notPaidBillsBadge")}
					</Badge>
				</div>
			</div>
			{isLoading ? (
				<div className="flex justify-center">
					<Loader />
				</div>
			) : null}
			{!isLoading && notPaid && notPaid.length > 0 ? (
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<p className="text-3xl font-bold">{formatCurrency(totalNotPaid)}</p>
						<p className="text-xs text-muted-foreground">
							{t("dashboard.notPaidBills.totalOutstanding")}
						</p>
					</div>
				</div>
			) : (
				<div className="p-4">{t("dashboard.noNotPaidBills")}</div>
			)}
			<Button asChild>
				<Link to={ROUTES.BILLS.path({ tab: "SENT" })}>
					{t("dashboard.notPaidBills.seeMore")}
				</Link>
			</Button>
		</section>
	);
};

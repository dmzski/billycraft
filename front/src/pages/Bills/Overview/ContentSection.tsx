import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useI18n } from "@/i18n";
import type { BillResponse } from "@/sdk";
import {
	calculatePriceTTC,
	getBillOrQuoteTotal,
	getBillOrQuoteTotalEt,
} from "@/utils/price";

type ContentSectionProps = {
	bill: BillResponse;
};

export const ContentSection = ({ bill }: ContentSectionProps) => {
	const { t, scopedT } = useI18n();
	const pageT = scopedT("bills.details");
	const formatCurrency = useFormatCurrency();

	return (
		<section>
			<h2 className="text-xl font-semibold">
				{pageT("sections.content.title")}
			</h2>
			<div className="border rounded-md p-4 flex flex-col gap-4 overflow-x-auto">
				<div className="flex flex-col gap-4 min-w-[1080px] ">
					<dl>
						<dt className="font-bold">{pageT("sections.content.name")}</dt>
						<dd>{bill.title}</dd>
					</dl>
					<div className="flex flex-col border">
						<div className="bg-accent text-accent-foreground grid grid-cols-12 gap-2 p-4">
							<div className="col-span-8">
								{pageT("sections.content.headers.name")}
							</div>
							<div>{pageT("sections.content.headers.quantity")}</div>
							<div>{pageT("sections.content.headers.etPrice")}</div>
							<div>{pageT("sections.content.headers.itPrice")}</div>
							<div>{pageT("sections.content.headers.subItTotal")}</div>
						</div>
						{bill.lines.map(
							({ line, name, price, quantity, description, type }) => (
								<div
									key={line}
									className="px-4 py-2 grid grid-cols-12 gap-2 [&:not(first)]:border-t"
								>
									<div className="col-span-8 flex flex-col">
										<p className="font-bolder">{name}</p>
										<p className="pl-4 opacity-70 whitespace-pre-wrap">
											{description}
										</p>
									</div>
									{type !== "TEXT" ? (
										<>
											<div>{quantity}</div>
											<div>{formatCurrency(price ?? 0)}</div>
											<div>
												{formatCurrency(calculatePriceTTC(price, bill.tva))}
											</div>
											<div>
												{formatCurrency(
													calculatePriceTTC(price, bill.tva) * (quantity ?? 0),
												)}
											</div>
										</>
									) : null}
								</div>
							),
						)}
					</div>
					<div className="grid grid-cols-12 *:p-2">
						<p className="col-start-10 border-b bg-accent text-accent-foreground">
							{t("etTotal")}
						</p>
						<p className="col-span-2 flex items-center border">
							{formatCurrency(getBillOrQuoteTotalEt(bill))}
						</p>
						<p className="col-start-10 border-b bg-accent text-accent-foreground">
							{t("vat")}
						</p>
						<p className="col-span-2 flex items-center border border-b-0 border-t-0">
							{formatCurrency(
								getBillOrQuoteTotal(bill) - getBillOrQuoteTotalEt(bill),
							)}
						</p>
						<p className="col-start-10 border-b bg-accent text-accent-foreground">
							{t("itTotal")}
						</p>
						<p className="col-span-2 flex items-center border">
							{formatCurrency(getBillOrQuoteTotal(bill))}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

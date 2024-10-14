import useCustomers from "@/hooks/useCustomers";
import Quote from "@/models/Quote";
import QuoteTableLine from "./Row";
import { useI18n } from "@/i18n";

type QuoteListProps = {
	data: Quote[];
	page?: "list" | "archived";
};
const QuoteList = ({ data, page }: QuoteListProps) => {
	const { t } = useI18n();
	const customers = useCustomers();

	return (
		<div className="flex flex-col">
			<div className="p-4 grid md:grid-cols-12 bg-base-300 border-b rounded-t">
				<div className="md:col-span-1">
					{t("quotes.list.headers.reference")}
				</div>
				<div className="md:col-span-3">{t("quotes.list.headers.title")}</div>
				<div className="md:col-span-2">{t("quotes.list.headers.customer")}</div>
				<div className="md:col-span-2">
					{t("quotes.list.headers.createdAt")}
				</div>
				<div className="md:col-span-2">
					{t("quotes.list.headers.updatedAt")}
				</div>
				<div className="md:col-span-2">{t("quotes.list.headers.status")}</div>
			</div>
			<div className="flex flex-col">
				{data.map((quote) => (
					<QuoteTableLine
						customer={customers.find((c) => c.id === quote.customerId)}
						key={quote.id}
						quote={quote}
						page={page}
					/>
				))}
			</div>
		</div>
	);
};

export default QuoteList;

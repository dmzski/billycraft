import Customer from "@/models/Customer";
import { useI18n } from "@/i18n";
import { ListRow } from "./ListRow";

export const List = ({ data = [] }: { data: Customer[] }) => {
	const { t } = useI18n();

	return (
		<div className="flex flex-col gap-2">
			<div className="hidden md:grid px-2 py-4 md:grid-cols-12 gap-4 text-muted-foreground text-sm">
				<div className="pl-12 md:col-span-6">
					{t("customers.list.headers.name")}
				</div>
				<div className="md:col-span-2">
					{t("customers.list.headers.contact")}
				</div>
				<div className="md:col-span-2">
					{t("customers.list.headers.phoneNumber")}
				</div>
				<div className="md:col-span-2">{t("customers.list.headers.email")}</div>
			</div>
			<div>
				{data.map((customer) => (
					<ListRow customer={customer} key={customer.id} />
				))}
			</div>
		</div>
	);
};

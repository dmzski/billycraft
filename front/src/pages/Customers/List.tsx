import Customer from "@/models/Customer";
import { useI18n } from "@/i18n";
import { ROUTES } from "@/routes";
import { CustomerLabel } from "@/components/labels/CustomerLabel";

const CustomerTable = ({ data = [] }: { data: Customer[] }) => {
	const { t } = useI18n();

	return (
		<div className="flex flex-col">
			<div className="px-2 py-4 grid md:grid-cols-4 text-muted-foreground text-sm">
				<div>{t("customers.list.headers.name")}</div>
				<div>{t("customers.list.headers.contact")}</div>
				<div>{t("customers.list.headers.phoneNumber")}</div>
				<div>{t("customers.list.headers.email")}</div>
			</div>
			<div>
				{data.map((customer) => (
					<div
						key={customer.id}
						className="border rounded-md grid md:grid-cols-4 p-2 md:h-16 items-center"
					>
						<div className="flex items-center">
							<CustomerLabel
								customer={customer}
								to={ROUTES.CUSTOMER_OVERVIEW.path({
									id: customer.id.toString(),
								})}
							/>
						</div>
						<div className="flex items-center">{customer.contact || "-"}</div>
						<div className="flex items-center">{customer.phoneNumber || "-"}</div>
						<div className="flex items-center">{customer.email || "-"}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CustomerTable;

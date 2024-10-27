import { Button, Loader } from "@coco-ui/core";
import CustomerTable from "./List";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useAllCustomersNotDeleted } from "@/queries/useAllCustomersNotDeleted";
import { useI18n } from "@/i18n";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";

const CustomerPage = () => {
	const { t } = useI18n();
	const { data, isLoading } = useAllCustomersNotDeleted();

	return (
		<>
			<div className="flex flex-wrap justify-between">
				<h1 className="text-3xl">{t("customers.list.title")}</h1>
				<Button asChild>
					<Link to={ROUTES.CUSTOMER_ADD.path()}>
						<PlusIcon />
						<span>{t("customers.list.add")}</span>
					</Link>
				</Button>
			</div>
			<div>
				{isLoading && !data ? (
					<div className="mt-2 flex justify-center">
						<Loader />
					</div>
				) : (
					<CustomerTable data={data ?? []} />
				)}
			</div>
		</>
	);
};

export default CustomerPage;

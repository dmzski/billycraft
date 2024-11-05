import { Button, Loader } from "@coco-ui/core";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useAllCustomersNotDeleted } from "@/queries/useAllCustomersNotDeleted";
import { useI18n } from "@/i18n";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";
import { List } from "./List";

const CustomerPage = () => {
	const { t } = useI18n();
	const { data, isLoading } = useAllCustomersNotDeleted();

	return (
		<div className="flex flex-col gap-12">
			<div className="flex flex-col gap-4 md:flex-row">
				<h1 className="text-3xl font-semibold flex-grow">
					{t("customers.list.title")}
				</h1>
				<Button asChild>
					<Link to={ROUTES.CUSTOMER_ADD.path()}>
						<PlusIcon />
						<span>{t("customers.list.add")}</span>
					</Link>
				</Button>
			</div>
			<div>
				{isLoading && !data ? (
					<div className="flex justify-center">
						<Loader />
					</div>
				) : (
					<List data={data ?? []} />
				)}
			</div>
		</div>
	);
};

export default CustomerPage;

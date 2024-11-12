import { Alert, Button, Loader } from "@billycraft/ui";
import SupplierList from "./List";
import SupplierModalForm from "./modals/SupplierModalForm";
import { useAllSuppliersQuery } from "@/queries/useAllSuppliersQuery";
import { useI18n } from "@/i18n";
import { PlusIcon } from "@heroicons/react/24/solid";

const Suppliers = () => {
	const { data, isLoading, reload } = useAllSuppliersQuery();
	const { scopedT, t } = useI18n();
	const pageT = scopedT("suppliers.list");

	const reloadData = async () => {
		await reload();
	};

	if (isLoading && !data) {
		return (
			<div className="flex justify-center">
				<Loader />
			</div>
		);
	}

	if (!data) {
		return <Alert variant="destructive">{t("genericDataLoadError")}</Alert>;
	}

	return (
		<div className="flex flex-col gap-12">
			<div className="flex flex-col md:flex-row gap-4">
				<h1 className="text-3xl flex-grow">{pageT("title")}</h1>
				<SupplierModalForm
					disclosure={
						<Button>
							<PlusIcon />
							{pageT("addButton")}
						</Button>
					}
					onSubmitSuccess={reloadData}
				/>
			</div>
			<SupplierList reloadData={reloadData} data={data} />
		</div>
	);
};

export default Suppliers;

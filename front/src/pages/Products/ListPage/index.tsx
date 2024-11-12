import Loader from "@/components/Loader";
import ProductTable from "./List";
import { useAllProductsQuery } from "@/queries/useAllProductsQuery";
import { useI18n } from "@/i18n";
import { AddProductModal } from "../modals/AddProductModal";
import { Button, Tabs } from "@billycraft/ui";
import { Filters } from "./Filters";
import { useMemo, useState } from "react";
import { ProductFilters, filterProducts } from "@/utils/products";
import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/solid";
import { UpdateStockModal } from "../modals/UpdateStockModal";
import { PRODUCT_TYPES, ProductType } from "@/models/LineTypeEnum";

const ProductsPage = () => {
	const { t } = useI18n();
	const [filters, setFilters] = useState<ProductFilters>({
		type: "",
		name: "",
		supplierId: "",
		groupId: "",
		lowStockOnly: false,
		noStockOnly: false,
	});
	const { data, isLoading, reload } = useAllProductsQuery();
	const [tab, setTab] = useState<"all" | ProductType>("all");

	const enhancedData = useMemo(
		() =>
			filterProducts(data?.sort((a, b) => a.name.localeCompare(b.name)) ?? [], {
				...filters,
				type: tab !== "all" && PRODUCT_TYPES.includes(tab) ? tab : "",
			}),
		[data, filters, tab],
	);

	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-5">
				<h1 className="text-3xl">{t("products.list.title")}</h1>
				<div>
					<Tabs>
						<Tabs.Tab isActive={tab === "all"} onClick={() => setTab("all")}>
							{t("all")}
						</Tabs.Tab>
						{PRODUCT_TYPES.map((type) => (
							<Tabs.Tab
								key={type}
								isActive={tab === type}
								onClick={() => setTab(type)}
							>
								{t(`products.type.${type}.label`)}
							</Tabs.Tab>
						))}
					</Tabs>
				</div>
				<div className="grid lg:grid-cols-12 gap-2">
					<p className="text-sm md:col-span-8">
						{t("products.list.description")}
					</p>
					<div className="lg:col-span-4 flex flex-col lg:flex-row lg:justify-end gap-4">
						<UpdateStockModal
							onSubmitSuccess={reload}
							disclosure={
								<Button variant="secondary">
									<ArrowPathIcon />
									{t("products.list.updateStocks")}
								</Button>
							}
						/>
						<AddProductModal
							disclosure={
								<Button>
									<PlusIcon />
									{t("products.list.add")}
								</Button>
							}
							onSubmitSuccess={reload}
						/>
					</div>
				</div>
			</div>
			<div className="flex-col justify-center items-center">
				{isLoading && !data ? (
					<div className="w-full flex justify-center">
						<Loader />
					</div>
				) : null}
				{data ? (
					<div className="flex flex-col gap-5">
						<Filters filters={filters} onChangeFilters={setFilters} />
						<ProductTable products={enhancedData} reloadProducts={reload} />
					</div>
				) : null}
			</div>
		</div>
	);
};

export default ProductsPage;

import { ProductApi } from "@/api/ProductApi";
import Product from "@/models/Product";
import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useAllProductsQuery = (
	config?: UseDataLoaderConfig<Product[], Error>,
) => {
	const key = ["products", "all"];

	return useDataLoader(key, () => ProductApi.findAll(), config);
};

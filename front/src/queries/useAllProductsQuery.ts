import { type ProductResponse, ProductsService } from "@/sdk";
import { type UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useAllProductsQuery = (
	config?: UseDataLoaderConfig<ProductResponse[], Error>,
) => {
	const key = ["products", "all"];

	return useDataLoader(
		key,
		() => ProductsService.getProducts().then(({ data }) => data),
		config,
	);
};

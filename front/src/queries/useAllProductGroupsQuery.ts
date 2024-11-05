import { ProductGroupApi } from "@/api/ProductGroupApi";
import { ProductGroup } from "@/models/ProductGroup";
import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useAllProductGroupsQuery = (
	dataLoaderConfig?: UseDataLoaderConfig<ProductGroup[], Error>,
) => {
	const key = ["product-group", "all"];

	return useDataLoader(key, () => ProductGroupApi.findAll(), dataLoaderConfig);
};

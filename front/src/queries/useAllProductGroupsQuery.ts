import { type ProductGroupResponse, ProductGroupsService } from "@/sdk";
import { type UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useAllProductGroupsQuery = (
	dataLoaderConfig?: UseDataLoaderConfig<ProductGroupResponse[], Error>,
) => {
	const key = ["product-group", "all"];

	return useDataLoader(
		key,
		() => ProductGroupsService.getProductGroups().then(({ data }) => data),
		dataLoaderConfig,
	);
};

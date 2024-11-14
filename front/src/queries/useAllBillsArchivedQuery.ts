import { BillsService, type GetBillsResponse } from "@/sdk";
import { useDataLoader } from "@scaleway/use-dataloader";

type DataLoaderConfig = Parameters<typeof useDataLoader<GetBillsResponse>>[2];

export const useAllBillsArchivedQuery = (config?: DataLoaderConfig) => {
	const key = ["bills", "all", "archived"];

	return useDataLoader(
		key,
		() =>
			BillsService.getBills({
				query: { status: ["ARCHIVED"] },
			}).then(({ data }) => data),
		config,
	);
};

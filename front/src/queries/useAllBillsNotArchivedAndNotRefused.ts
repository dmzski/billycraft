import { type BillResponse, BillsService } from "@/sdk";
import { useDataLoader } from "@scaleway/use-dataloader";

type DataLoaderConfig = Parameters<typeof useDataLoader<BillResponse[]>>[2];

export const useAllBillsNotArchivedAndNotRefused = (
	config?: DataLoaderConfig,
) => {
	const key = ["bills", "all", "not-archived", "not-refused"];

	return useDataLoader(
		key,
		() =>
			BillsService.getBills({
				query: { not_status: ["ARCHIVED", "REFUSED"] },
			}).then(({ data }) => data),
		config,
	);
};

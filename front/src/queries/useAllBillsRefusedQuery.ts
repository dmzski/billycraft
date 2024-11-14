import { type BillResponse, BillsService } from "@/sdk";
import { type UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useAllBillsRefusedQuery = (
	config?: UseDataLoaderConfig<BillResponse[], Error>,
) => {
	const key = ["bills", "all", "refused"];

	return useDataLoader(
		key,
		() =>
			BillsService.getBills({ query: { status: ["REFUSED"] } }).then(
				({ data }) => data,
			),
		config,
	);
};

import { type BillResponse, BillsService } from "@/sdk"
import { useDataLoader } from "@scaleway/use-dataloader"

type DataLoaderConfig = Parameters<typeof useDataLoader<BillResponse[]>>[2]

export const useAllBillsQuery = (config?: DataLoaderConfig) => {
	const key = ["bills", "all"].flat()

	return useDataLoader(
		key,
		() => BillsService.getBills().then(({ data }) => data),
		config,
	)
}

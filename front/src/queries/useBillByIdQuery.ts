import { type BillResponse, BillsService, type GetBillsByIdData } from "@/sdk"
import {
	type UseDataLoaderConfig,
	useDataLoader,
} from "@scaleway/use-dataloader"

export const useBillByIdQuery = (
	id: GetBillsByIdData["path"]["id"],
	config?: UseDataLoaderConfig<BillResponse, Error>,
) => {
	const key = ["bill", "by-id", id]

	return useDataLoader(
		key,
		() => BillsService.getBillsById({ path: { id } }).then(({ data }) => data),
		config,
	)
}

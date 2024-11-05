import { BillApi } from "@/api/BillApi";
import Bill from "@/models/Bill";
import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useBillByIdQuery = (
	id: Parameters<typeof BillApi.findById>[0],
	config?: UseDataLoaderConfig<Bill, Error>,
) => {
	const key = ["bill", "by-id", id];

	return useDataLoader(key, () => BillApi.findById(id), config);
};

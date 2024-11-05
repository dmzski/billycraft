import { BillApi } from "@/api/BillApi";
import Bill from "@/models/Bill";
import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useAllBillsRefusedQuery = (
	config?: UseDataLoaderConfig<Bill[], Error>,
) => {
	const key = ["bills", "all", "refused"];

	return useDataLoader(key, () => BillApi.findAllRefused(), config);
};

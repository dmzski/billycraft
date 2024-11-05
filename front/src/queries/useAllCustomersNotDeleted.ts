import { CustomerApi } from "@/api/CustomerApi";
import Customer from "@/models/Customer";
import { useDataLoader } from "@scaleway/use-dataloader";

type DataLoaderConfig = Parameters<typeof useDataLoader<Customer[]>>[2];
export const useAllCustomersNotDeleted = (config?: DataLoaderConfig) => {
	const key = ["customers", "all", "not-deleted"];

	return useDataLoader(key, () => CustomerApi.findAllNotDeleted(), config);
};

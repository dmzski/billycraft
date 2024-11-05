import { CustomerApi } from "@/api/CustomerApi";
import Customer from "@/models/Customer";
import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useCustomerQuery = (
	id: Parameters<typeof CustomerApi.findById>[0],
	config?: UseDataLoaderConfig<Customer, Error>,
) => {
	const key = ["customers", "by-id", id];

	return useDataLoader(key, () => CustomerApi.findById(id), config);
};

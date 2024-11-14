import { type CustomerResponse, CustomersService } from "@/sdk";
import {
	type UseDataLoaderConfig,
	useDataLoader,
} from "@scaleway/use-dataloader";

export const useCustomerQuery = (
	id: CustomerResponse["id"],
	config?: UseDataLoaderConfig<CustomerResponse, Error>,
) => {
	const key = ["customers", "by-id", id];

	return useDataLoader(
		key,
		() =>
			CustomersService.getCustomersById({
				path: {
					id: id ?? "",
				},
			}).then(({ data }) => data),
		config,
	);
};

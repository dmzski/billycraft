import { type CustomerResponse, CustomersService } from "@/sdk"
import { useDataLoader } from "@scaleway/use-dataloader"

type DataLoaderConfig = Parameters<typeof useDataLoader<CustomerResponse[]>>[2]
export const useAllCustomersNotDeleted = (config?: DataLoaderConfig) => {
	const key = ["customers", "all", "not-deleted"]

	return useDataLoader(
		key,
		() => CustomersService.getCustomers().then(({ data }) => data),
		config,
	)
}

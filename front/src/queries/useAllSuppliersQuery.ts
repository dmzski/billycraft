import { type SupplierResponse, SuppliersService } from "@/sdk";
import { useDataLoader } from "@scaleway/use-dataloader";

type DataLoaderConfig = Parameters<typeof useDataLoader<SupplierResponse[]>>[2];

export const useAllSuppliersQuery = (config?: DataLoaderConfig) => {
	const key = ["suppliers", "all"].flat();

	return useDataLoader(
		key,
		() => SuppliersService.getSuppliers().then(({ data }) => data),
		config,
	);
};

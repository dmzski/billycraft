import { type OutgoingResponse, OutgoingsService } from "@/sdk";
import { useDataLoader } from "@scaleway/use-dataloader";

type DataLoaderConfig = Parameters<typeof useDataLoader<OutgoingResponse[]>>[2];

export const useAllOutgoingsQuery = (config?: DataLoaderConfig) => {
	const key = ["outgoings", "all"].flat();

	return useDataLoader(key, () => OutgoingsService.getOutgoings().then(({data}) => data), config);
};

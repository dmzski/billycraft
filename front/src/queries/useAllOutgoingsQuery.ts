import { OutgoingApi } from "@/api/OutgoingApi";
import { OutgoingResponse } from "@/models/Outgoing";
import { useDataLoader } from "@scaleway/use-dataloader";

type DataLoaderConfig = Parameters<typeof useDataLoader<OutgoingResponse[]>>[2];

export const useAllOutgoingsQuery = (config?: DataLoaderConfig) => {
	const key = ["outgoings", "all"].flat();

	return useDataLoader(key, () => OutgoingApi.findAll(), config);
};

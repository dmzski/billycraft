import {
	type GetOutgoingsByIdData,
	type OutgoingResponse,
	OutgoingsService,
} from "@/sdk";
import { useDataLoader } from "@scaleway/use-dataloader";

type DataLoaderConfig = Parameters<typeof useDataLoader<OutgoingResponse>>[2];

export const useOutgoingByIdQuery = (
	id: GetOutgoingsByIdData["path"]["id"],
	config?: DataLoaderConfig,
) => {
	const key = ["outgoings", "by-id", id].flat();

	return useDataLoader(
		key,
		() =>
			OutgoingsService.getOutgoingsById({ path: { id } }).then(
				({ data }) => data,
			),
		config,
	);
};

import { type OutgoingResponse, OutgoingsService } from "@/sdk"
import { useDataLoader } from "@scaleway/use-dataloader"

type DataLoaderConfig = Parameters<typeof useDataLoader<OutgoingResponse>>[2]

export const useOutgoingCurrentQuery = (config?: DataLoaderConfig) => {
	const key = ["outgoings", "current"].flat()

	return useDataLoader(
		key,
		() => OutgoingsService.getOutgoingsCurrent().then(({ data }) => data),
		config,
	)
}

import { QuoteApi } from "@/api/QuoteApi";
import Quote from "@/models/Quote";
import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useAllQuotesArchivedQuery = (
	config?: UseDataLoaderConfig<Quote[], Error>,
) => {
	const key = ["quotes", "all", "archived"];

	return useDataLoader(key, () => QuoteApi.findAllArchived(), config);
};

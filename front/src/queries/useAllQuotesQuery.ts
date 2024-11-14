import { type QuoteResponse, QuotesService } from "@/sdk";
import {
	type UseDataLoaderConfig,
	useDataLoader,
} from "@scaleway/use-dataloader";

export const useAllQuotesQuery = (
	dataLoaderConfig?: UseDataLoaderConfig<QuoteResponse[], Error>,
) => {
	const key = ["quotes", "all"];

	return useDataLoader(
		key,
		() => QuotesService.getQuotes().then(({ data }) => data),
		dataLoaderConfig,
	);
};

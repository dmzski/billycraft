import { QuoteApi } from "@/api/QuoteApi";
import Quote from "@/models/Quote";
import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useAllQuotesQuery = (
	dataLoaderConfig?: UseDataLoaderConfig<Quote[], Error>,
) => {
	const key = ["quotes", "all"];

	return useDataLoader(key, () => QuoteApi.findAll(), dataLoaderConfig);
};

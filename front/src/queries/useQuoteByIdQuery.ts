import {
	type GetQuotesByIdData,
	type QuoteResponse,
	QuotesService,
} from "@/sdk";
import {
	type UseDataLoaderConfig,
	useDataLoader,
} from "@scaleway/use-dataloader";

export const useQuoteByIdQuery = (
	id: GetQuotesByIdData["path"]["id"],
	config?: UseDataLoaderConfig<QuoteResponse, Error>,
) => {
	const key = ["quote", "by-id", id];

	return useDataLoader(
		key,
		() =>
			QuotesService.getQuotesById({ path: { id } }).then(({ data }) => data),
		config,
	);
};

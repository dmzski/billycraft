import {
	type QuoteCustomizationResponse,
	QuoteCustomizationService,
} from "@/sdk";
import {
	type UseDataLoaderConfig,
	useDataLoader,
} from "@scaleway/use-dataloader";

export const useMyQuoteCustomizationQuery = (
	options?: UseDataLoaderConfig<QuoteCustomizationResponse, Error>,
) => {
	const key = ["quote-customization", "mine"];

	return useDataLoader(
		key,
		() =>
			QuoteCustomizationService.getQuoteCustomizationMine().then(
				({ data }) => data,
			),
		options,
	);
};

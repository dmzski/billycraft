import { QuoteCustomizationApi } from "@/api/QuoteCustomizationApi";
import QuoteCustomization from "@/models/QuoteCustomization";
import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useMyQuoteCustomizationQuery = (
	options?: UseDataLoaderConfig<QuoteCustomization, Error>,
) => {
	const key = ["quote-customization", "mine"];

	return useDataLoader(key, () => QuoteCustomizationApi.findMine(), options);
};

import { QuoteApi } from "@/api/QuoteApi";
import Quote from "@/models/Quote";
import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useAllQuotesNotArchivedAndNotRefused = (config?: UseDataLoaderConfig<Quote[], Error>) => {
  const key = ['quotes', 'all', 'not-archived', 'not-refused']

  return useDataLoader(key, () => QuoteApi.findAllNotArchivedAndNotRefused(), config)
}

import { QuoteApi } from "@/api/QuoteApi";
import Quote from "@/models/Quote";
import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useQuoteByIdQuery = (id: Parameters<typeof QuoteApi.findById>[0], config?: UseDataLoaderConfig<Quote | undefined, Error>) => {
  const key = ['quote', 'by-id', id]

  return useDataLoader(key, () => QuoteApi.findById(id), config)
}

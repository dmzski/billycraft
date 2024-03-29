import { QuoteApi } from '@/api/QuoteApi'
import Quote from '@/models/Quote'
import { UseDataLoaderConfig, useDataLoader } from '@scaleway/use-dataloader'

export const useAllQuotesRefusedQuery = (config?: UseDataLoaderConfig<Quote[], Error>) => {
  const key = ['quotes', 'all', 'refused']

  return useDataLoader(key, () => QuoteApi.findAllRefused(), config)
}

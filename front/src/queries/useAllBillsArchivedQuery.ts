import { BillApi } from '@/api/BillApi'
import Bill from '@/models/Bill'
import { useDataLoader } from '@scaleway/use-dataloader'

type DataLoaderConfig = Parameters<typeof useDataLoader<Bill[]>>[2]

export const useAllBillsArchivedQuery = (config?: DataLoaderConfig) => {
  const key = ['bills', 'all', 'archived']

  return useDataLoader(key, () => BillApi.findAllArchived(), config)
}

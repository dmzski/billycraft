import { BillApi } from '@/api/BillApi'
import Bill from '@/models/Bill'
import { useDataLoader } from '@scaleway/use-dataloader'

type DataLoaderConfig = Parameters<typeof useDataLoader<Bill[]>>[2]

export const useAllBillsQuery = (config?: DataLoaderConfig) => {
  const key = ['bills', 'all'].flat()

  return useDataLoader(key, () => BillApi.findAll(), config)
}

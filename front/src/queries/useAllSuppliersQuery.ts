import { SupplierApi } from '@/api/SupplierApi'
import Supplier from '@/models/Supplier'
import { useDataLoader } from '@scaleway/use-dataloader'

type DataLoaderConfig = Parameters<typeof useDataLoader<Supplier[]>>[2]

export const useAllSuppliersQuery = (config?: DataLoaderConfig) => {
  const key = ['suppliers', 'all'].flat()

  return useDataLoader(key, () => SupplierApi.findAll(), config)
}

import { ProductApi } from '@/api/ProductApi'
import { useDataLoader } from '@scaleway/use-dataloader'

export const useAllProductsQuery = () => {
  const key = ['products', 'all']

  return useDataLoader(key, () => ProductApi.findAll())
}

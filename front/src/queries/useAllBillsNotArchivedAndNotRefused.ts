import { BillApi } from "@/api/BillApi"
import Bill from "@/models/Bill"
import { useDataLoader } from "@scaleway/use-dataloader"

type DataLoaderConfig = Parameters<typeof useDataLoader<Bill[]>>[2]

export const useAllBillsNotArchivedAndNotRefused = (config?: DataLoaderConfig) => {
  const key = ['bills', 'all', 'not-archived', 'not-refused']

  return useDataLoader(key, () => BillApi.findAllNotArchivedAndNotRefused(), config)
}

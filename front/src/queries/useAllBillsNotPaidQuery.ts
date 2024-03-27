import { BillApi } from '@/api/BillApi'
import { useDataLoader } from '@scaleway/use-dataloader'

export const useAllBillsNotPaidQuery = () => {
  const key = ['bills', 'not-paid']

  return useDataLoader(key, () => BillApi.findAllNotPaid())
}

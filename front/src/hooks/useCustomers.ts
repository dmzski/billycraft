import { CustomerApi } from '@/api/CustomerApi'
import Customer from '@/models/Customer'
import { useDataLoader } from '@scaleway/use-dataloader'

export default (): Customer[] => {
  const { data } = useDataLoader('customers', () => CustomerApi.findAll())
  return data ?? []
}

import { BillApi } from '@/api/BillApi'
import Loader from '@/components/Loader'
import useCustomers from '@/hooks/useCustomers'
import BillFilterContainer from '@/pages/Bills/Filters'
import BillTable from '@/pages/Bills/List'
import { useState, useMemo } from 'react'
import { filterBills } from '@/utils/bill'
import { useDataLoader } from '@scaleway/use-dataloader'

type BillFilters = Record<string, string>

const RefusedTab = () => {
  const customers = useCustomers()
  const [filters, setFilters] = useState<BillFilters>({})
  const {data, isLoading} = useDataLoader(['bills', 'refused'], BillApi.findAllRefused)

  const billSorted = useMemo(() => filterBills(data ?? [], filters, customers), [customers, data, filters])

  return (
    <>
      <BillFilterContainer disabledFilters={['status']} filters={filters} setFilters={setFilters} />
      <BillTable data={billSorted} />
      {isLoading ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </>
  )
}

export default RefusedTab

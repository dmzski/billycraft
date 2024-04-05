import Loader from '@/components/Loader'
import useCustomers from '@/hooks/useCustomers'
import BillFilterContainer from '@/pages/Bills/Filters'
import BillTable from '@/pages/Bills/List'
import { useState, useMemo } from 'react'
import { filterBills } from '@/utils/bill'
import { useAllBillsRefusedQuery } from '@/queries/useAllBillsRefusedQuery'

type BillFilters = Record<string, string>

const RefusedTab = () => {
  const customers = useCustomers()
  const [filters, setFilters] = useState<BillFilters>({})
  const { data, isLoading } = useAllBillsRefusedQuery()

  const billSorted = useMemo(
    () => filterBills(data ?? [], filters, customers),
    [customers, data, filters],
  )

  return (
    <>
      <BillFilterContainer disabledFilters={['status']} filters={filters} setFilters={setFilters} />
      <BillTable data={billSorted} />
      {isLoading && !data ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </>
  )
}

export default RefusedTab

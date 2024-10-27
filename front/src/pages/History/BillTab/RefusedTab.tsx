import Loader from '@/components/Loader'
import useCustomers from '@/hooks/useCustomers'
import BillFilterContainer from '@/pages/Bills/Filters'
import BillTable from '@/pages/Bills/List'
import { useState, useMemo } from 'react'
import { useAllBillsRefusedQuery } from '@/queries/useAllBillsRefusedQuery'
import { filterBillsOrQuotes } from '@/utils/filters'

type BillFilters = Record<string, string>

const RefusedTab = () => {
  const customers = useCustomers()
  const [filters, setFilters] = useState<BillFilters>({})
  const { data, isLoading } = useAllBillsRefusedQuery()

  const billSorted = useMemo(
    () => filterBillsOrQuotes(data ?? [], filters, customers),
    [customers, data, filters],
  )

  return (
    <>
      <BillFilterContainer disabledFilters={['status']} filters={filters} setFilters={setFilters} />
      <BillTable page="refused" data={billSorted} />
      {isLoading && !data ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </>
  )
}

export default RefusedTab

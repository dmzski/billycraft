import { BillApi } from 'api/BillApi'
import Loader from 'components/Loader'
import useCustomers from 'hooks/useCustomers'
import BillFilterContainer from 'pages/Bills/Filters'
import BillTable from 'pages/Bills/List'
import { useState, useMemo } from 'react'
import { useQuery } from 'react-query'
import { filterBills } from 'utils/bill'

type BillFilters = Record<string, string>

const RefusedTab = (): JSX.Element => {
  const customers = useCustomers()
  const [filters, setFilters] = useState<BillFilters>({})
  const billsQuery = useQuery(['bills', 'refused'], BillApi.findAllRefused)

  const billSorted = useMemo(() => filterBills(billsQuery.data ?? [], filters, customers), [
    billsQuery.data,
    filters,
  ])

  return (
    <>
      <BillFilterContainer disabledFilters={['status']} filters={filters} setFilters={setFilters} />
      <BillTable data={billSorted} />
      {billsQuery.isLoading ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </>
  )
}

export default RefusedTab

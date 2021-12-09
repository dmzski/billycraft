import { BillApi } from 'api/BillApi'
import Loader from 'components/Loader'
import useCustomers from 'hooks/useCustomers'
import BillFilterContainer from 'pages/Bills/Filters'
import BillTable from 'pages/Bills/List'
import { useState, useCallback } from 'react';
import { useQuery } from 'react-query'
import { filterBills, sortBills } from 'utils/bill'

type BillFilters = Record<string, string>

const BillTab = (): JSX.Element => {
  const customers = useCustomers()
  const [filters, setFilters] = useState<BillFilters>({})
  const billsQuery = useQuery('bills-archived', BillApi.findAllArchived)

  const billSorted = useCallback(
    () => sortBills(filterBills(billsQuery.data ?? [], filters, customers)),
    [billsQuery.data, filters],
  )

  return (
    <>
      <BillFilterContainer filters={filters} setFilters={setFilters} />
      <BillTable data={billSorted()} />
      {billsQuery.isLoading ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </>
  )
}

export default BillTab

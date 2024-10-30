import Loader from '@/components/Loader'
import useCustomers from '@/hooks/useCustomers'
import BillFilterContainer from '@/pages/Bills/Filters'
import BillTable from '@/pages/Bills/List'
import { useState, useMemo } from 'react'
import { useAllBillsArchivedQuery } from '@/queries/useAllBillsArchivedQuery'
import { filterBillsOrQuotes } from '@/utils/filters'

const HistoryTab = () => {
  const customers = useCustomers()
	const [filters, setFilters] = useState<
		Parameters<typeof filterBillsOrQuotes>[1]
	>({
		name: "",
		customer: "",
		createdAt: "",
		title: "",
		status: "",
	});
  const { data, isLoading } = useAllBillsArchivedQuery()

  const billSorted = useMemo(
    () => filterBillsOrQuotes(data ?? [], filters, customers),
    [customers, data, filters],
  )

  return (
    <>
    <div>
    <BillFilterContainer filters={filters} setFilters={setFilters} />

    </div>
      <BillTable page="archived" data={billSorted} />
      {isLoading && !data ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </>
  )
}

export default HistoryTab

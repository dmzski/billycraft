import { QuoteApi } from '@/api/QuoteApi'
import Loader from '@/components/Loader'
import useCustomers from '@/hooks/useCustomers'
import QuoteFilterContainer from '@/pages/Quotes/Filters'
import QuoteList from '@/pages/Quotes/List/List'
import { useMemo, useState } from 'react'
import { filterQuotes } from '@/utils/quote'
import { useDataLoader } from '@scaleway/use-dataloader'

type QuoteFilters = Record<string, string>
const HistoryTab = () => {
  const customers = useCustomers()
  const [filters, setFilters] = useState<QuoteFilters>({})

  const { data, isLoading } = useDataLoader(['quotes', 'refused'], QuoteApi.findAllRefused)
  const quoteSorted = useMemo(
    () => filterQuotes(data ?? [], filters, customers),
    [data, filters, customers],
  )
  return (
    <>
      <QuoteFilterContainer
        disabledFilters={['status']}
        filters={filters}
        setFilters={setFilters}
      />
      <QuoteList data={quoteSorted} />
      {isLoading ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </>
  )
}

export default HistoryTab

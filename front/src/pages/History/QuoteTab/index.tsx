import { QuoteApi } from 'api/QuoteApi'
import Loader from 'components/Loader'
import useCustomers from 'hooks/useCustomers'
import QuoteFilterContainer from 'pages/Quotes/Filters'
import QuoteList from 'pages/Quotes/List'
import { useCallback, useState } from 'react'
import { useQuery } from 'react-query'
import { filterQuotes, sortQuotes } from 'utils/quote'

type QuoteFilters = Record<string, string>
const QuoteTab = (): JSX.Element => {
  const customers = useCustomers()
  const [filters, setFilters] = useState<QuoteFilters>({})

  const quotesQuery = useQuery('quotes-archived', QuoteApi.findAllArchived, {
    refetchOnWindowFocus: false,
  })
  const quoteSorted = useCallback(
    () => sortQuotes(filterQuotes(quotesQuery.data ?? [], filters, customers)),
    [filters, quotesQuery.data],
  )
  return (
    <>
      <QuoteFilterContainer filters={filters} setFilters={setFilters} />
      <QuoteList data={quoteSorted()} />
      {quotesQuery.isLoading ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </>
  )
}

export default QuoteTab

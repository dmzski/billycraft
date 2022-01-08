import { useCallback, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
import { Button, Loader } from '@coco-ui/core'
import { ROUTES } from 'routes'
import { QuoteApi } from 'api/QuoteApi'
import useCustomers from 'hooks/useCustomers'
import QuoteFilterContainer from './Filters'
import { filterQuotes } from '../../utils/quote'
import QuoteList from './List'

type QuoteFilters = Record<string, string>

const QuotePage = (): JSX.Element => {
  const customers = useCustomers()
  const [filters, setFilters] = useState<QuoteFilters>({})

  const quotesQuery = useQuery('quotes', QuoteApi.findAllNotArchivedAndNotRefused, {
    refetchOnWindowFocus: false,
  })
  const history = useHistory()

  const quoteSorted = useCallback(() => filterQuotes(quotesQuery.data ?? [], filters, customers), [
    filters,
    quotesQuery.data,
  ])

  const goToNewQuote = () => {
    history.push(ROUTES.QUOTE_FORM.path.replace(':id', 'new'))
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-3xl">Devis</h2>
        <Button size="md" onClick={goToNewQuote} icon="plus">
          <p>Nouveau devis</p>
        </Button>
      </div>
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

export default QuotePage

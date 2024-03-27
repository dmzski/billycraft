import { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Loader } from '@coco-ui/core'
import { ROUTES } from '@/routes'
import { QuoteApi } from '@/api/QuoteApi'
import useCustomers from '@/hooks/useCustomers'
import QuoteFilterContainer from './Filters'
import { filterQuotes } from '../../utils/quote'
import QuoteList from './List/List'
import { useDataLoader } from '@scaleway/use-dataloader'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'

type QuoteFilters = Record<string, string>

const QuotePage = () => {
  const { t } = useI18n()
  const customers = useCustomers()
  const [filters, setFilters] = useState<QuoteFilters>({})

  const { isLoading, data } = useDataLoader('quotes', QuoteApi.findAllNotArchivedAndNotRefused)
  const history = useHistory()

  const quoteSorted = useMemo(
    () => filterQuotes(data ?? [], filters, customers),
    [customers, filters, data],
  )

  const goToNewQuote = () => {
    history.push(ROUTES.QUOTE_FORM.path.replace(':id', 'new'))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h2 className="text-3xl">Devis</h2>
        <Button className="gap-1" size="md" variant="primary" onClick={goToNewQuote}>
          <PlusIcon className="w-5" />
          {t('quotes.list.add')}
        </Button>
      </div>
      <QuoteFilterContainer filters={filters} setFilters={setFilters} />
      <QuoteList data={quoteSorted} />
      {isLoading ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </div>
  )
}

export default QuotePage

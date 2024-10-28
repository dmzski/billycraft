import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Loader } from '@coco-ui/core'
import { ROUTES } from '@/routes'
import useCustomers from '@/hooks/useCustomers'
import QuoteFilterContainer from './Filters'
import QuoteList from './List/List'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'
import { useAllQuotesNotArchivedAndNotRefused } from '@/queries/useAllQuotesNotArchivedAndNotRefused'
import { filterBillsOrQuotes } from '@/utils/filters'

type QuoteFilters = Record<string, string>

const QuotePage = () => {
  const { t } = useI18n()
  const customers = useCustomers()
  const [filters, setFilters] = useState<QuoteFilters>({})

  const { isLoading, data } = useAllQuotesNotArchivedAndNotRefused()

  const quoteSorted = useMemo(
    () => filterBillsOrQuotes(data ?? [], filters, customers),
    [customers, filters, data],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h2 className="text-3xl">Devis</h2>
        <Button asChild>
          <Link to={ROUTES.QUOTE_ADD.path()}>
            <PlusIcon />
            {t('quotes.list.add')}
          </Link>
        </Button>
      </div>
      <QuoteFilterContainer filters={filters} setFilters={setFilters} />
      <QuoteList data={quoteSorted} />
      {isLoading && !data ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </div>
  )
}

export default QuotePage

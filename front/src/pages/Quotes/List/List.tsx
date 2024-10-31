import useCustomers from '@/hooks/useCustomers'
import Quote from '@/models/Quote'
import QuoteTableLine from './Row'
import { useI18n } from '@/i18n'

type QuoteListProps = {
  data: Quote[]
  page?: 'list' | 'archived' | 'refused'
  reload: () => Promise<void>
}
const QuoteList = ({ data, page, reload }: QuoteListProps) => {
  const { t } = useI18n()
  const customers = useCustomers()

  return (
    <div className="flex flex-col">
      <div className="p-4 grid md:grid-cols-4 text-muted-foreground text-sm">
        <div className="md:pl-12">{t('bills.list.headers.reference')}</div>
        <div>{t('bills.list.headers.customer')}</div>
        <div>{t('bills.list.headers.createdAt')}</div>
        <div>{t('bills.list.headers.status')}</div>
      </div>
      <div className="flex flex-col gap-2">
        {data.map(quote => (
          <QuoteTableLine
            reload={reload}
            customer={customers.find(c => c.id === quote.customerId)}
            key={quote.id}
            quote={quote}
            page={page}
          />
        ))}
      </div>
    </div>
  )
}

export default QuoteList

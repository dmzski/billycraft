import { Button, Dropdown, useToast } from '@coco-ui/core'
import { QuoteApi } from '@/api/QuoteApi'
import { formatISO9075, parseJSON } from 'date-fns'
import Customer from '@/models/Customer'
import Quote, { QuoteStatusEnum } from '@/models/Quote'
import { Link } from 'react-router-dom'
import { MouseEvent, useMemo } from 'react'
import { ROUTES } from '@/routes'
import { useDataLoaderContext } from '@scaleway/use-dataloader'
import { useI18n } from '@/i18n'

type QuoteTableLineProps = {
  quote: Quote
  customer?: Customer
}
const QuoteTableLine = ({ quote, customer }: QuoteTableLineProps) => {
  const { t } = useI18n()
  const { reload } = useDataLoaderContext()
  const toast = useToast()

  const updateQuoteStatus = (status: QuoteStatusEnum) => (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const updateStatus = async () => {
      try {
        if (quote.id) await QuoteApi.updateStatus({ id: quote.id, status })
        toast.success(t('quotes.list.statusUpdated'))
        reload('quotes')
      } catch {
        toast.error(t('genericFormError'))
      }
    }
    updateStatus()
  }

  const nextStatuses = useMemo(() => {
    switch (quote.status) {
      case QuoteStatusEnum.SENT:
        return [
          QuoteStatusEnum.ACCEPTED,
          QuoteStatusEnum.REFUSED,
          QuoteStatusEnum.DEPOSIT_ASK,
          QuoteStatusEnum.DEPOSIT_PAID,
          QuoteStatusEnum.ARCHIVED,
        ].sort()
      case QuoteStatusEnum.REFUSED:
        return [QuoteStatusEnum.DRAFT, QuoteStatusEnum.ARCHIVED].sort()
      case QuoteStatusEnum.ACCEPTED:
        return [
          QuoteStatusEnum.DEPOSIT_ASK,
          QuoteStatusEnum.DEPOSIT_PAID,
          QuoteStatusEnum.ARCHIVED,
        ].sort()
      case QuoteStatusEnum.DEPOSIT_ASK:
        return [QuoteStatusEnum.DEPOSIT_PAID, QuoteStatusEnum.ARCHIVED].sort()
      case QuoteStatusEnum.DEPOSIT_PAID:
        return [QuoteStatusEnum.ARCHIVED].sort()
      case QuoteStatusEnum.DRAFT:
      default:
        return [
          QuoteStatusEnum.DRAFT,
          QuoteStatusEnum.SENT,
          QuoteStatusEnum.DEPOSIT_ASK,
          QuoteStatusEnum.DEPOSIT_PAID,
          QuoteStatusEnum.ACCEPTED,
          QuoteStatusEnum.REFUSED,
          QuoteStatusEnum.ARCHIVED,
        ].sort()
    }
  }, [quote])

  return (
    <div className="grid md:grid-cols-12 px-4 py-2 items-center border-b">
      <div className="md:col-span-1 text-sm">
        <Link
          className="link-primary"
          to={ROUTES.QUOTE_FORM.path.replace(':id', quote.id ?? 'new')}
        >
          {quote.id}
        </Link>
      </div>
      <div className="md:col-span-3 truncate">{quote.title}</div>
      <div className="md:col-span-2 truncate">{customer?.name ?? '-'}</div>
      <div className="md:col-span-2">
        {quote.createdAt ? formatISO9075(parseJSON(quote.createdAt)) : ''}
      </div>
      <div className="md:col-span-2">
        {quote.updatedAt ? formatISO9075(parseJSON(quote.updatedAt)) : '-'}
      </div>
      <div className="md:col-span-2">
        <Dropdown>
          <Button>{t(`quotes.status.${quote.status}`)}</Button>
          <Dropdown.Content>
            {nextStatuses.map(s => (
              <Dropdown.Button key={s} onClick={updateQuoteStatus(s)}>
                {t(`quotes.status.${s}`)}
              </Dropdown.Button>
            ))}
          </Dropdown.Content>
        </Dropdown>
      </div>
    </div>
  )
}

export default QuoteTableLine

import { Button, Dropdown, useToast } from '@coco-ui/core'
import { QuoteApi } from '@/api/QuoteApi'
import { formatISO9075, parseJSON } from 'date-fns'
import Customer from '@/models/Customer'
import Quote, { QuoteStatusEnum } from '@/models/Quote'
import { Link } from 'react-router-dom'
import { MouseEvent, useCallback, useMemo } from 'react'
import { ROUTES } from '@/routes'
import { STRINGS } from '@/constants/strings'
import { QUOTE_STATUS } from '../../constants/quote'
import { useDataLoaderContext } from '@scaleway/use-dataloader'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'

type QuoteTableLineProps = {
  quote: Quote
  customer?: Customer
}
const QuoteTableLine = ({ quote, customer }: QuoteTableLineProps) => {
  const { reload } = useDataLoaderContext()
  const toast = useToast()

  const updateQuoteStatus = (status: QuoteStatusEnum) => (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const updateStatus = async () => {
      try {
        if (quote.id) await QuoteApi.updateStatus({ id: quote.id, status })
        toast.success(STRINGS.SAVE_SUCCESS)
        reload('quotes')
      } catch {
        toast.error(STRINGS.SAVE_ERROR)
      }
    }
    updateStatus()
  }

  const getStatus = useMemo(() => {
    const status = Object.values(QUOTE_STATUS).find(s => s.enum === quote.status)
    const IconComponent = status?.icon ?? QuestionMarkCircleIcon

    return (
      <div className="flex items-center">
        <IconComponent className='w-5'/>
        <span className="ml-1">{status?.text}</span>
      </div>
    )
  }, [quote])

  const getNextStatuses = useCallback(() => {
    const array = []
    switch (quote.status) {
      case QuoteStatusEnum.SENT:
        array.push(
          QUOTE_STATUS.ACCEPTED,
          QUOTE_STATUS.REFUSED,
          QUOTE_STATUS.DEPOSIT_ASK,
          QUOTE_STATUS.DEPOSIT_PAID,
          QUOTE_STATUS.ARCHIVED,
        )
        break
      case QuoteStatusEnum.REFUSED:
        array.push(QUOTE_STATUS.DRAFT, QUOTE_STATUS.ARCHIVED)
        break
      case QuoteStatusEnum.ACCEPTED:
        array.push(
          QUOTE_STATUS.DRAFT,
          QUOTE_STATUS.DEPOSIT_ASK,
          QUOTE_STATUS.DEPOSIT_PAID,
          QUOTE_STATUS.ARCHIVED,
        )
        break
      case QuoteStatusEnum.DEPOSIT_ASK:
        array.push(QUOTE_STATUS.DEPOSIT_PAID, QUOTE_STATUS.ARCHIVED)
        break
      case QuoteStatusEnum.DEPOSIT_PAID:
        array.push(QUOTE_STATUS.ARCHIVED)
        break
      case QuoteStatusEnum.DRAFT:
      default:
        array.push(...Object.values(QUOTE_STATUS))
    }
    return array
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
      <div className="md:col-span-2 truncate">{customer?.name ?? 'N.C'}</div>
      <div className="md:col-span-2">
        {quote.createdAt ? formatISO9075(parseJSON(quote.createdAt)) : ''}
      </div>
      <div className="md:col-span-2">
        {quote.sentAt ? formatISO9075(parseJSON(quote.sentAt)) : '-'}
      </div>
      <div className="md:col-span-2">
        <Dropdown>
          <Button>{getStatus}</Button>
          <Dropdown.Content>
            {getNextStatuses().map(s => {
              const IconComponent = s.icon
              return (
                <Dropdown.Button
                  key={s.enum}
                  onClick={updateQuoteStatus(s.enum as QuoteStatusEnum)}
                >
                  <div className="flex items-center">
                    <IconComponent className="mr-2 w-5" />
                    <span>{s.text}</span>
                  </div>
                </Dropdown.Button>
              )
            })}
          </Dropdown.Content>
        </Dropdown>
      </div>
    </div>
  )
}

export default QuoteTableLine

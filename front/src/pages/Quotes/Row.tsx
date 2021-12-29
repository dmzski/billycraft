import { ActionButton, Icon, useToast } from '@coco-ui/core'
import { QuoteApi } from 'api/QuoteApi'
import { formatISO9075, parseJSON } from 'date-fns'
import Customer from 'models/Customer'
import Quote, { QuoteStatusEnum } from 'models/Quote'
import { useMutation, useQueryCache } from 'react-query'
import { Link } from 'react-router-dom'
import { MouseEvent, useCallback, useMemo } from 'react'
import { ROUTES } from 'routes'
import { STRINGS } from 'constants/strings'
import { IconName } from '@coco-ui/core/dist/components/Icon'
import clsx from 'clsx'
import { QUOTE_STATUS } from '../../constants/quote'

type QuoteTableLineProps = {
  quote: Quote
  customer?: Customer
  index: number
}
const QuoteTableLine = ({ quote, customer, index }: QuoteTableLineProps): JSX.Element => {
  const queryCache = useQueryCache()
  const toast = useToast()

  const [updateQuoteStatusMutation, updateQuoteStatusMutationState] = useMutation(
    QuoteApi.updateStatus,
  )

  const updateQuoteStatus = (status: QuoteStatusEnum) => (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (updateQuoteStatusMutationState.isLoading) {
      return
    }
    const updateStatus = async () => {
      try {
        if (quote.id) await updateQuoteStatusMutation({ id: quote.id, status })
        toast.success(STRINGS.SAVE_SUCCESS)
        queryCache.invalidateQueries('quotes')
      } catch {
        toast.error(STRINGS.SAVE_ERROR)
      }
    }
    updateStatus()
  }

  const getStatus = useMemo(() => {
    const status = Object.values(QUOTE_STATUS).find(s => s.enum === quote.status)

    return (
      <div className="flex items-center">
        <Icon name={(status?.icon as IconName) || 'question-mark-circle'} />
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
    <div
      className={clsx('grid md:grid-cols-12 p-2 items-center', { 'bg-gray-50': index % 2 === 0 })}
    >
      <div className="md:col-span-1 text-xs">
        <Link
          className="text-primary-700 underline font-bold"
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
        <ActionButton size="sm" variant="outline">
          <ActionButton.Content>{getStatus}</ActionButton.Content>
          {getNextStatuses().map(s => (
            <ActionButton.Action
              key={s.enum}
              onClick={updateQuoteStatus(s.enum as QuoteStatusEnum)}
            >
              <div className="flex items-center">
                <Icon className="mr-2" name={s.icon as IconName} />
                <span>{s.text}</span>
              </div>
            </ActionButton.Action>
          ))}
        </ActionButton>
      </div>
    </div>
  )
}

export default QuoteTableLine

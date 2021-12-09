import { ActionButton, Icon, Table } from '@coco-ui/core'
import { QuoteApi } from 'api/QuoteApi'
import { format, parseJSON } from 'date-fns'
import Customer from 'models/Customer'
import Quote, { QuoteStatusEnum } from 'models/Quote'
import { useMutation, useQueryCache } from 'react-query'
import { useHistory } from 'react-router-dom'
import { MouseEvent, useCallback, useMemo } from 'react'
import { ROUTES } from 'routes'
import { STRINGS } from 'constants/strings'
import { IconName } from '@coco-ui/core/dist/components/Icon'
import { QUOTE_STATUS } from '../../constants/quote'
import { useToast } from '../../providers/ToastProvider'
import { getQuoteTotal } from '../../utils/quote'

type QuoteTableLineProps = {
  quote: Quote
  customer?: Customer
}
const QuoteTableLine = ({ quote, customer }: QuoteTableLineProps): JSX.Element => {
  const queryCache = useQueryCache()
  const toast = useToast()
  const history = useHistory()

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
        toast.show({ message: STRINGS.SAVE_SUCCESS, variant: 'success' })
        queryCache.invalidateQueries('quotes')
      } catch {
        toast.show({ message: STRINGS.SAVE_ERROR, variant: 'error' })
      }
    }
    updateStatus()
  }

  const editQuote = () => {
    history.push(ROUTES.QUOTE_FORM.path.replace(':id', quote.id ?? 'new'))
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
    <Table.Row hoverable onClick={editQuote}>
      <Table.Cell className="pl-2 py-3 truncate">{quote.title}</Table.Cell>
      <Table.Cell className="truncate">{customer?.name ?? 'N.C'}</Table.Cell>
      <Table.Cell className="">
        {quote.createdAt ? format(parseJSON(quote.createdAt), 'dd/MM/yyyy à HH:mm') : '-'}
      </Table.Cell>
      <Table.Cell className="">
        {quote.sentAt ? format(parseJSON(quote.sentAt), 'dd/MM/yyyy à HH:mm') : '-'}
      </Table.Cell>
      <Table.Cell className="">{Math.round(getQuoteTotal(quote) * 100) / 100} €</Table.Cell>
      <Table.Cell
        className=""
        onClick={event => {
          event.stopPropagation()
        }}
      >
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
      </Table.Cell>
    </Table.Row>
  )
}

export default QuoteTableLine

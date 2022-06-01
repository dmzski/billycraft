import { ActionButton, Icon, Table, useToast } from '@coco-ui/core'
import { IconName } from '@coco-ui/core/dist/components/Icon'
import { BillApi } from 'api/BillApi'
import clsx from 'clsx'
import { STRINGS } from 'constants/strings'
import { formatISO9075, parseJSON } from 'date-fns'
import Bill, { BillStatusEnum } from 'models/Bill'
import Customer from 'models/Customer'
import { useMemo, useCallback, MouseEvent } from 'react'
import { useMutation, useQueryCache } from 'react-query'
import { Link } from 'react-router-dom'
import { ROUTES } from 'routes'
import { sendErrorToSentry } from 'utils/errors'
import { BILL_STATUS } from '../../../constants/bill'

type BillTableLineProps = {
  bill: Bill
  customer?: Customer
  index: number
}
const BillTableLine = ({ bill, customer, index }: BillTableLineProps): JSX.Element => {
  const queryCache = useQueryCache()
  const toast = useToast()

  const [updateBillStatusMutation, updateBillStatusMutationState] = useMutation(
    BillApi.updateStatus,
    {
      throwOnError: true,
    },
  )

  const updateBillStatus = (status: BillStatusEnum) => (e: MouseEvent) => {
    e.stopPropagation()
    if (updateBillStatusMutationState.isLoading) {
      return
    }
    const updateStatus = async () => {
      try {
        if (bill.id) await updateBillStatusMutation({ id: bill.id, status })
        toast.success(STRINGS.SAVE_SUCCESS)
        queryCache.invalidateQueries('bills')
      } catch (error) {
        sendErrorToSentry(error)
        toast.error(STRINGS.SAVE_ERROR)
      }
    }
    updateStatus()
  }

  const getStatus = useMemo(() => {
    const status = Object.values(BILL_STATUS).find(s => s.enum === bill.status)

    return (
      <div className="flex items-center">
        <Icon name={(status?.icon as IconName) || 'question-mark-circle'} />
        <span className="ml-1">{status?.text}</span>
      </div>
    )
  }, [bill])

  const getNextStatuses = useCallback(() => {
    const array = []
    switch (bill.status) {
      case BillStatusEnum.SENT:
        array.push(
          BILL_STATUS.REFUSED,
          BILL_STATUS.PAYMENT_PAID,
          BILL_STATUS.TO_DECLARE,
          BILL_STATUS.ARCHIVED,
        )
        break
      case BillStatusEnum.REFUSED:
        array.push(BILL_STATUS.DRAFT, BILL_STATUS.ARCHIVED)
        break
      case BillStatusEnum.PAYMENT_PAID:
        array.push(BILL_STATUS.TO_DECLARE)
        array.push(BILL_STATUS.ARCHIVED)
        break
      case BillStatusEnum.DRAFT:
      default:
        array.push(...Object.values(BILL_STATUS))
    }
    return array
  }, [bill])

  return (
    <div
      className={clsx('grid md:grid-cols-12 p-2 items-center', { 'bg-gray-50': index % 2 === 0 })}
    >
      <div className="md:col-span-1 text-xs">
        <Link
          className="text-primary-700 underline font-bold"
          to={ROUTES.BILL_FORM.path.replace(':id', bill.id ?? 'new')}
        >
          {bill.id}
        </Link>
      </div>
      <div className="md:col-span-3 truncate">{bill.title}</div>
      <div className="md:col-span-2 truncate">{customer?.name ?? 'N.C'}</div>
      <div className="md:col-span-2">
        {bill.createdAt ? formatISO9075(parseJSON(bill.createdAt)) : ''}
      </div>
      <div className="md:col-span-2">
        {bill.sentAt ? formatISO9075(parseJSON(bill.sentAt)) : '-'}
      </div>
      <div className="md:col-span-2">
        <ActionButton size="sm" variant="outline">
          <ActionButton.Content>{getStatus}</ActionButton.Content>
          {getNextStatuses().map(s => (
            <ActionButton.Action key={s.enum} onClick={updateBillStatus(s.enum as BillStatusEnum)}>
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

export default BillTableLine

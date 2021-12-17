import { ActionButton, Icon, Table } from '@coco-ui/core'
import { IconName } from '@coco-ui/core/dist/components/Icon'
import { BillApi } from 'api/BillApi'
import { STRINGS } from 'constants/strings'
import { format, formatISO9075, parseJSON } from 'date-fns'
import Bill, { BillStatusEnum } from 'models/Bill'
import Customer from 'models/Customer'
import { useMemo, useCallback, MouseEvent } from 'react'
import { useMutation, useQueryCache } from 'react-query'
import { useHistory } from 'react-router-dom'
import { ROUTES } from 'routes'
import { BILL_STATUS } from '../../../constants/bill'
import { useToast } from '../../../providers/ToastProvider'
import { getBillTotal } from '../../../utils/bill'

type BillTableLineProps = {
  bill: Bill
  customer?: Customer
}
const BillTableLine = ({ bill, customer }: BillTableLineProps): JSX.Element => {
  const queryCache = useQueryCache()
  const toast = useToast()
  const history = useHistory()

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
        toast.show({ message: STRINGS.SAVE_SUCCESS, variant: 'success' })
        queryCache.invalidateQueries('bills')
      } catch {
        toast.show({
          message: STRINGS.SAVE_ERROR,
          variant: 'error',
        })
      }
    }
    updateStatus()
  }

  const editBill = () => {
    history.push(ROUTES.BILL_FORM.path.replace(':id', bill.id))
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
    <Table.Row onClick={editBill} hoverable>
      <Table.Cell className="pl-2 truncate">{bill.title}</Table.Cell>
      <Table.Cell className="truncate">{customer?.name ?? 'N.C'}</Table.Cell>
      <Table.Cell>{bill.createdAt ? formatISO9075(parseJSON(bill.createdAt)) : ''}</Table.Cell>
      <Table.Cell>{bill.sentAt ? formatISO9075(parseJSON(bill.sentAt)) : ''}</Table.Cell>
      <Table.Cell>{Math.round(getBillTotal(bill) * 100) / 100} €</Table.Cell>
      <Table.Cell
        onClick={event => {
          event.stopPropagation()
        }}
      >
        <ActionButton size="xs" variant="outline">
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
      </Table.Cell>
    </Table.Row>
  )
}

export default BillTableLine

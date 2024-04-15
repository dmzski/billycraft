import { Button, Dropdown, useToast } from '@coco-ui/core'
import { BillApi } from '@/api/BillApi'
import { formatISO9075, parseJSON } from 'date-fns'
import Bill, { BillStatusEnum } from '@/models/Bill'
import Customer from '@/models/Customer'
import { useMemo, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { useI18n } from '@/i18n'
import { useAllBillsNotArchivedAndNotRefused } from '@/queries/useAllBillsNotArchivedAndNotRefused'

type BillTableLineProps = {
  bill: Bill
  customer?: Customer
}
const BillTableLine = ({ bill, customer }: BillTableLineProps) => {
  const { reload } = useAllBillsNotArchivedAndNotRefused({ enabled: false })
  const toast = useToast()
  const { t } = useI18n()

  const updateBillStatus = (status: BillStatusEnum) => (e: MouseEvent) => {
    e.stopPropagation()
    const updateStatus = async () => {
      try {
        if (bill.id) await BillApi.updateStatus({ id: bill.id, status })
        toast.success(t('bills.list.statusUpdated'))
        reload()
      } catch {
        toast.error(t('genericFormError'))
      }
    }
    updateStatus()
  }

  const nextStatuses: BillStatusEnum[] = useMemo(() => {
    switch (bill.status) {
      case BillStatusEnum.SENT:
        return [
          BillStatusEnum.REFUSED,
          BillStatusEnum.TO_DECLARE,
          BillStatusEnum.ARCHIVED,
        ]
      case BillStatusEnum.REFUSED:
        return [BillStatusEnum.DRAFT, BillStatusEnum.ARCHIVED]
      case BillStatusEnum.TO_DECLARE:
        return [BillStatusEnum.ARCHIVED]
      default:
        return [BillStatusEnum.SENT, BillStatusEnum.ARCHIVED]
    }
  }, [bill])

  return (
    <div className="grid md:grid-cols-12 px-4 py-2 items-center border-b">
      <div className="md:col-span-1 text-sm">
        <Link className="link-primary" to={ROUTES.BILL_OVERVIEW.path({id: bill.id})}>
          {bill.id}
        </Link>
      </div>
      <div className="md:col-span-3 truncate">{bill.title}</div>
      <div className="md:col-span-2 truncate">{customer?.name ?? '-'}</div>
      <div className="md:col-span-2">{formatISO9075(parseJSON(bill.createdAt))}</div>
      <div className="md:col-span-2">
        {bill.updatedAt ? formatISO9075(parseJSON(bill.updatedAt)) : '-'}
      </div>
      <div className="md:col-span-2">
        <Dropdown>
          <Button>{t(`bills.status.${bill.status}`)}</Button>
          <Dropdown.Content>
            {nextStatuses.map(s => (
              <Dropdown.Button key={s} onClick={updateBillStatus(s)}>
                {t(`bills.status.${s}`)}
              </Dropdown.Button>
            ))}
          </Dropdown.Content>
        </Dropdown>
      </div>
    </div>
  )
}

export default BillTableLine

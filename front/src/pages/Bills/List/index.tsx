import { Table, useTableState } from '@coco-ui/core'
import useCustomers from '@/hooks/useCustomers'
import Bill from '@/models/Bill'
import BillTableLine from './Row'
import { useI18n } from '@/i18n'

const BillList = ({ data }: { data: Bill[] }) => {
  const { t } = useI18n()
  const customers = useCustomers()
  const { data: bills } = useTableState({
    data,
    initialSort: { field: 'createdAt', order: 'desc' },
  })

  return (
    <Table>
      <Table.Head
       columns={[
        {name: t('bills.list.headers.reference')},
        {name: t('bills.list.headers.title')},
        {name: t('bills.list.headers.customer')},
        {name: t('bills.list.headers.createdAt')},
        {name: t('bills.list.headers.updatedAt')},
        {name: t('bills.list.headers.status')}
       ]}
      />
      <Table.Body>
        {bills.map(bill => (
          <BillTableLine
            customer={customers.find(c => c.id === bill.customerId)}
            key={bill.id}
            bill={bill}
          />
        ))}
      </Table.Body>
    </Table>
  )
}

export default BillList

import useCustomers from '@/hooks/useCustomers'
import Bill from '@/models/Bill'
import BillTableLine from './Row'
import { useI18n } from '@/i18n'

type BillListProps = {
  data: Bill[]
  page?: 'list' | 'archived' | 'refused'
}

const BillList = ({ data, page }: BillListProps) => {
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
        {data.map(bill => (
          <BillTableLine
            customer={customers.find(c => c.id === bill.customerId)}
            key={bill.id}
            bill={bill}
            page={page}
          />
        ))}
      </div>
    </div>
  )
}

export default BillList

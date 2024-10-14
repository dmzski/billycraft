import useCustomers from '@/hooks/useCustomers'
import Bill from '@/models/Bill'
import BillTableLine from './Row'
import { useI18n } from '@/i18n'

type BillListProps = {
  data: Bill[]
  page?: 'list' | 'archived'
}

const BillList = ({ data, page }: BillListProps) => {
  const { t } = useI18n()
  const customers = useCustomers()

  return (
    <div className="flex flex-col">
      <div className="p-4 grid md:grid-cols-12 bg-base-300 border-b rounded-t">
        <div className="col-span-1">{t('bills.list.headers.reference')}</div>
        <div className="col-span-3">{t('bills.list.headers.title')}</div>
        <div className="col-span-2">{t('bills.list.headers.customer')}</div>
        <div className="col-span-2">{t('bills.list.headers.createdAt')}</div>
        <div className="col-span-2">{t('bills.list.headers.updatedAt')}</div>
        <div className="col-span-2">{t('bills.list.headers.status')}</div>
      </div>
      <div className="flex flex-col">
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

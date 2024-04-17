import clsx from 'clsx'
import { formatISO9075, parseJSON } from 'date-fns'
import useCustomers from '@/hooks/useCustomers'
import Bill from '@/models/Bill'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { useI18n } from '@/i18n'

type NotPaidBillListProps = {
  data: Bill[]
}
const NotPaidBillList = ({ data }: NotPaidBillListProps) => {
  const customers = useCustomers()
  const { t } = useI18n()
  return (
    <div className="border rounded flex flex-col">
      <div className="px-2 py-4 grid md:grid-cols-12 bg-base-300 rounded-t gap-2">
        <div className="pl-1 md:col-span-1">{t('dashboard.notPaidBills.headers.reference')}</div>
        <div className="md:col-span-2">{t('dashboard.notPaidBills.headers.sentAt')}</div>
        <div className="md:col-span-3">{t('dashboard.notPaidBills.headers.customer')}</div>
        <div className="md:col-span-6">{t('dashboard.notPaidBills.headers.title')}</div>
      </div>
      {data.map(({ id, name, title, customerId, sentAt }, index) => (
        <div
          className={clsx('py-4 px-2 grid md:grid-cols-12', {
            'bg-base-200': index % 2 !== 0,
          })}
        >
          <div>
            <Link to={ROUTES.BILL_FORM.path({ id })} className="link-hover link-primary">
              {name}
            </Link>
          </div>
          <div className="md:col-span-2">{sentAt ? formatISO9075(parseJSON(sentAt)) : '-'}</div>
          <div className="md:col-span-3">
            {customers.find(({ id: cId }) => cId === customerId)?.name}
          </div>
          <div className="md:col-span-6 truncate">{title}</div>
        </div>
      ))}
    </div>
  )
}

export default NotPaidBillList

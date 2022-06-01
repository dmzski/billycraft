import clsx from 'clsx'
import { formatISO9075, parseJSON } from 'date-fns'
import useCustomers from 'hooks/useCustomers'
import Bill from 'models/Bill'
import { Link } from 'react-router-dom'
import { ROUTES } from 'routes'

type NotPaidBillListProps = {
  data: Bill[]
}
const NotPaidBillList = ({ data }: NotPaidBillListProps): JSX.Element => {
  const customers = useCustomers()
  return (
    <div className="border rounded">
      <div className="px-2 py-4 grid md:grid-cols-12 bg-primary-50 text-primary-700 rounded-t gap-2">
        <div className="pl-1 md:col-span-1">#</div>
        <div className="md:col-span-2">Envoyée le</div>
        <div className="md:col-span-3">Client</div>
        <div className="md:col-span-6">Titre</div>
      </div>
      {data.map(({ id, title, customerId, sentAt }, index) => (
        <div
          className={clsx('py-4 px-2 mb-2 grid md:grid-cols-12', {
            'bg-gray-50': index % 2 === 0,
          })}
        >
          <div className="md:col-span-1 text-sm">
            <Link
              to={ROUTES.BILL_FORM.path.replace(':id', id)}
              className="text-primary-700 underline font-bold"
            >
              {id}
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

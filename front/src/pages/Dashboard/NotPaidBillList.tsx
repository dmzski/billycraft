import { BillApi } from 'api/BillApi'
import { formatISO9075, parseJSON } from 'date-fns'
import useCustomers from 'hooks/useCustomers'
import Bill from 'models/Bill'
import React from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { ROUTES } from 'routes'

type NotPaidBillListProps = {
  data: Bill[]
}
const NotPaidBillList = ({ data }: NotPaidBillListProps): JSX.Element => {
  const customers = useCustomers()
  return (
    <div>
      <div className="px-2 mb-2 grid grid-cols-4">
        <div>#</div>
        <div>Envoyée le</div>
        <div>Client</div>
        <div>Titre</div>
      </div>
      {data.map(({ id, title, customerId, sentAt }) => (
        <div className="shadow p-2 grid grid-cols-4">
          <div>
            <Link
              to={ROUTES.BILL_FORM.path.replace(':id', id)}
              className="text-primary-700 underlinecfont-bold"
            >
              {id}
            </Link>
          </div>
          <div>{sentAt ? formatISO9075(parseJSON(sentAt)) : '-'}</div>
          <div>{customers.find(({ id: cId }) => cId === customerId)?.name}</div>
          <div className="truncate">{title}</div>
        </div>
      ))}
    </div>
  )
}

export default NotPaidBillList

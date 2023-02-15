import { Link } from 'react-router-dom'
import CustomerModal from 'pages/Customers/Modals/CustomerModal'
import Customer from 'models/Customer'
import { ROUTES } from 'routes'
import clsx from 'clsx'

const QuoteTableLine = ({
  customer,
  index,
}: {
  customer: Customer
  index: number
}): JSX.Element => (
  <div
    className={clsx('grid md:grid-cols-12 p-2 py-4 items-center', {
      'bg-base-200': index % 2 !== 0,
    })}
  >
    <div className="md:col-span-3">
      <CustomerModal
        disclosure={
          <Link
            className="link-primary"
            to={ROUTES.CUSTOMER_FORM.path.replace(':id', `${customer.id}`)}
          >
            {customer.name}
          </Link>
        }
        customer={customer}
      />
    </div>
    <div className="md:col-span-3">{customer.contact}</div>
    <div className="md:col-span-3">
      {customer.phoneNumber
        ? customer.phoneNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
        : ''}
    </div>
    <div className="md:col-span-3">{customer.email}</div>
  </div>
)

export default QuoteTableLine

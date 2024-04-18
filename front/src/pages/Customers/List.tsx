import Customer from '@/models/Customer'
import { useI18n } from '@/i18n'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes'

const CustomerTable = ({ data = [] }: { data: Customer[] }) => {
  const { t } = useI18n()

  return (
    <div className="mt-2 flex flex-col">
      <div className="px-2 py-4 grid md:grid-cols-12 bg-base-200 border-b rounded-t">
        <div className="md:col-span-3">{t('customers.list.headers.name')}</div>
        <div className="md:col-span-3">{t('customers.list.headers.contact')}</div>
        <div className="md:col-span-3">{t('customers.list.headers.phoneNumber')}</div>
        <div className="md:col-span-3">{t('customers.list.headers.email')}</div>
      </div>
      <div>
        {data.map(customer => (
          <div key={customer.id} className="grid md:grid-cols-12 p-2 py-4 items-center border-b">
            <div className="md:col-span-3">
              <Link
                to={ROUTES.CUSTOMER_OVERVIEW.path({ id: customer.id.toString() })}
                className="link-hover link-primary"
              >
                {customer.name}
              </Link>
            </div>
            <div className="md:col-span-3">{customer.contact ?? '-'}</div>
            <div className="md:col-span-3">{customer.phoneNumber ?? '-'}</div>
            <div className="md:col-span-3">{customer.email ?? '-'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomerTable

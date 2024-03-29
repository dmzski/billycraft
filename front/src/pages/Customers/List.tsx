import Customer from '@/models/Customer'
import { useI18n } from '@/i18n'
import CustomerModal from './modals/CustomerModal'
import { Button } from '@coco-ui/core'
import { useAllCustomersNotDeleted } from '@/queries/useAllCustomersNotDeleted'

const CustomerTable = ({ data = [] }: { data: Customer[] }) => {
  const { t } = useI18n()
  const { reload } = useAllCustomersNotDeleted({ enabled: false })

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
          <div className="grid md:grid-cols-12 p-2 py-4 items-center border-b">
            <div className="md:col-span-3">
              <CustomerModal
                onSubmitSuccess={reload}
                disclosure={
                  <Button variant="ghost" className="link-primary">
                    {customer.name}
                  </Button>
                }
                customer={customer}
              />
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

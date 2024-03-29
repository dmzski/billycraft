import { Button, Loader } from '@coco-ui/core'
import CustomerTable from './List'
import CustomerModal from './modals/CustomerModal'
import Customer from '../../models/Customer'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useAllCustomersNotDeleted } from '@/queries/useAllCustomersNotDeleted'
import { useI18n } from '@/i18n'

const CustomerPage = () => {
  const { t } = useI18n()
  const { data, isLoading, reload } = useAllCustomersNotDeleted()

  return (
    <>
      <div className="flex flex-wrap justify-between">
        <h1 className="text-3xl">{t('customers.list.title')}</h1>
        <CustomerModal
          onSubmitSuccess={reload}
          customer={{} as Customer}
          disclosure={
            <Button variant="primary" className="gap-1" size="md">
              <PlusIcon className="w-5" />
              <span>{t('customers.list.add')}</span>
            </Button>
          }
        />
      </div>
      <div>
        {isLoading && !data ? (
          <div className="mt-2 flex justify-center">
            <Loader />
          </div>
        ) : (
          <CustomerTable data={data ?? []} />
        )}
      </div>
    </>
  )
}

export default CustomerPage

import { Button, Loader } from '@coco-ui/core'
import { CustomerApi } from '@/api/CustomerApi'
import CustomerTable from './List'
import CustomerModal from './Modals/CustomerModal'
import Customer from '../../models/Customer'
import { useDataLoader } from '@scaleway/use-dataloader'
import { PlusIcon } from '@heroicons/react/24/solid'

const CustomerPage = () => {
  const customersQuery = useDataLoader(['customers', 'not-deleted'], CustomerApi.findAllNotDeleted)

  return (
    <>
      <div className="flex flex-wrap justify-between">
        <h1 className="text-3xl">Clients</h1>
        <CustomerModal
          customer={{} as Customer}
          disclosure={
            <Button variant="primary" size="md">
              <PlusIcon />
              &nbsp; Nouveau client
            </Button>
          }
        />
      </div>
      <div>
        <CustomerTable data={customersQuery.data ?? []} />
        {customersQuery.isLoading && (
          <div className="mt-2 flex justify-center">
            <Loader />
          </div>
        )}
      </div>
    </>
  )
}

export default CustomerPage

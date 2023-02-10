import { useState } from 'react'
import { useQuery } from 'react-query'
import { Button, Icon, Loader } from '@coco-ui/core'
import { CustomerApi } from 'api/CustomerApi'
import CustomerTable from './List'
import CustomerModal from './Modals/CustomerModal'
import Customer from '../../models/Customer'

const CustomerPage = (): JSX.Element => {
  const customersQuery = useQuery(['customers', 'not-deleted'], CustomerApi.findAllNotDeleted, {
    refetchOnWindowFocus: false,
  })
  const [isOpen, setIsOpen] = useState(false)

  const goToNewCustomer = () => {
    setIsOpen(true)
  }

  return (
    <>
      <div className="flex flex-wrap justify-between">
        <h1 className="text-3xl">Clients</h1>
        <CustomerModal
          customer={{} as Customer}
          disclosure={
            <Button variant="primary" size="md" onClick={goToNewCustomer}>
              <Icon name="plus" />
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

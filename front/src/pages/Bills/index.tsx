import { useCallback, useState } from 'react'
import { useQuery } from 'react-query'
import { Button, Loader } from '@coco-ui/core'
import useCustomers from 'hooks/useCustomers'
import { BillApi } from 'api/BillApi'
import { useHistory } from 'react-router-dom'
import { ROUTES } from 'routes'
import BillFilterContainer from './Filters'
import { filterBills } from '../../utils/bill'
import BillTable from './List'

type BillFilters = Record<string, string>

const BillPage = (): JSX.Element => {
  const customers = useCustomers()
  const [filters, setFilters] = useState<BillFilters>({})
  const billsQuery = useQuery('bills', BillApi.findAllNotArchivedAndNotRefused)
  const history = useHistory()

  const billSorted = useCallback(() => filterBills(billsQuery.data ?? [], filters, customers), [
    billsQuery.data,
    filters,
  ])

  const goToNewBill = () => {
    history.push(ROUTES.BILL_FORM.path.replace(':id', 'new'))
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl">Factures</h1>
        <Button size="md" icon="plus" onClick={goToNewBill}>
          Nouvelle facture
        </Button>
      </div>
      <BillFilterContainer filters={filters} setFilters={setFilters} />
      <BillTable data={billSorted()} />
      {billsQuery.isLoading ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </>
  )
}

export default BillPage

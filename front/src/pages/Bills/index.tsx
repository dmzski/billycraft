import { useCallback, useState } from 'react'
import { Button, Icon, Loader } from '@coco-ui/core'
import useCustomers from '@/hooks/useCustomers'
import { BillApi } from '@/api/BillApi'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '@/routes'
import BillFilterContainer from './Filters'
import { filterBills } from '../../utils/bill'
import BillTable from './List'
import { useDataLoader } from '@scaleway/use-dataloader'

type BillFilters = Record<string, string>

const BillPage = () => {
  const customers = useCustomers()
  const [filters, setFilters] = useState<BillFilters>({})
  const { data, isLoading } = useDataLoader('bills', () => BillApi.findAllNotArchivedAndNotRefused())
  const history = useHistory()

  const billSorted = useCallback(
    () => filterBills(data ?? [], filters, customers),
    [customers, data, filters],
  )

  const goToNewBill = () => {
    history.push(ROUTES.BILL_FORM.path.replace(':id', 'new'))
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl">Factures</h1>
        <Button size="md" variant="primary" onClick={goToNewBill}>
          <Icon name="plus" />
          &nbsp; Nouvelle facture
        </Button>
      </div>
      <BillFilterContainer filters={filters} setFilters={setFilters} />
      <BillTable data={billSorted()} />
      {isLoading ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </>
  )
}

export default BillPage

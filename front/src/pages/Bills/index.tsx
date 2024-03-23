import { useMemo, useState } from 'react'
import { Button, Loader } from '@coco-ui/core'
import useCustomers from '@/hooks/useCustomers'
import { BillApi } from '@/api/BillApi'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '@/routes'
import BillFilterContainer from './Filters'
import { filterBills } from '../../utils/bill'
import BillTable from './List'
import { useDataLoader } from '@scaleway/use-dataloader'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'

type BillFilters = Record<string, string>

const BillPage = () => {
  const customers = useCustomers()
  const [filters, setFilters] = useState<BillFilters>({})
  const { data, isLoading } = useDataLoader('bills', () => BillApi.findAllNotArchivedAndNotRefused())
  const history = useHistory()
  const { t } = useI18n()

  const billSorted = useMemo(
    () => filterBills(data ?? [], filters, customers),
    [customers, data, filters],
  )

  const goToNewBill = () => {
    history.push(ROUTES.BILL_FORM.path.replace(':id', 'new'))
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex justify-between">
        <h1 className="text-3xl">{t('bills.list.title')}</h1>
        <Button size="md" className='gap-1' variant="primary" onClick={goToNewBill}>
          <PlusIcon className='w-5' />
          <span>{t('bills.list.add')}</span>
        </Button>
      </div>
      <BillFilterContainer filters={filters} setFilters={setFilters} />
      <BillTable data={billSorted} />
      {isLoading ? (
        <div className="mt-2 flex justify-center">
          <Loader variant='primary' />
        </div>
      ) : null}
    </div>
  )
}

export default BillPage

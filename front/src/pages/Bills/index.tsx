import { useMemo, useState } from 'react'
import { Loader } from '@coco-ui/core'
import useCustomers from '@/hooks/useCustomers'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes'
import BillFilterContainer from './Filters'
import { filterBills } from '@/utils/bill'
import BillTable from './List'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'
import { useAllBillsNotArchivedAndNotRefused } from '@/queries/useAllBillsNotArchivedAndNotRefused'

type BillFilters = Record<string, string>

const BillPage = () => {
  const customers = useCustomers()
  const [filters, setFilters] = useState<BillFilters>({})
  const { data, isLoading } = useAllBillsNotArchivedAndNotRefused()
  const { t } = useI18n()

  const billSorted = useMemo(
    () => filterBills(data ?? [], filters, customers),
    [customers, data, filters],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl">{t('bills.list.title')}</h1>
        <Link className="gap-1 btn btn-primary" to={ROUTES.BILL_ADD.path()}>
          <PlusIcon className="w-5" />
          <span>{t('bills.list.add')}</span>
        </Link>
      </div>
      <BillFilterContainer filters={filters} setFilters={setFilters} />
      <BillTable data={billSorted} />
      {isLoading ? (
        <div className="mt-2 flex justify-center">
          <Loader variant="primary" />
        </div>
      ) : null}
    </div>
  )
}

export default BillPage

import { Badge, Loader } from '@coco-ui/core'
import NotPaidBillList from './NotPaidBillList'
import TodoList from './TodoList'
import { BanknotesIcon, ListBulletIcon } from '@heroicons/react/24/solid'
import { useAllBillsNotPaidQuery } from '@/queries/useAllBillsNotPaidQuery'
import { useAllTodosFinishedAfter } from '@/queries/useAllTodosFinishedAfter'
import { useI18n } from '@/i18n'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { useMemo } from 'react'
import { getBillOrQuoteTotal } from '@/utils/price'

const DATE_OFFSET_TODOS = 24 * 60 * 60 * 1000 * 1 // 1 days

const Dashboard = () => {
  const { t } = useI18n()
  const formatCurrency = useFormatCurrency()
  const { data: notPaid, isLoading } = useAllBillsNotPaidQuery()
  const dateOffset = useMemo(() => new Date(Date.now() - DATE_OFFSET_TODOS), [])
  const { data: todos, reload } = useAllTodosFinishedAfter(dateOffset)

  const totalNotPaid =
    notPaid && Array.isArray(notPaid)
      ? Math.floor(notPaid.reduce((acc, bill) => acc + getBillOrQuoteTotal(bill), 0) * 100) / 100
      : 0

  const todoCount = todos?.filter(({ doneAt }) => !doneAt).length ?? 0

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-center">
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <div className="grid md:grid-cols-2 gap-2 justify-center items-center">
          <div>
            <Badge variant={notPaid?.length ? 'default' : 'outline'}>
              {notPaid?.length} {t('dashboard.notPaidBillsBadge')}
            </Badge>
          </div>
          <div>
            <Badge variant={todoCount > 0 ? 'default' : 'outline'}>
              {todoCount} {t('dashboard.todosBadge')}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-12">
        <section className="flex flex-col gap-4 border rounded-md p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl gap-2 flex items-center font-semibold flex-grow">
              <ListBulletIcon className="size-6" />
              {t('dashboard.todos.title')}
            </h2>
          </div>
          <TodoList data={todos} onSubmitSuccess={reload} />
        </section>
        <section className="flex flex-col gap-4 border rounded-md p-4">
          <div className="flex justify-between">
            <div className="flex text-xl gap-2">
              <BanknotesIcon className="w-5" />
              <h2>{t('dashboard.notPaidBills.title')}</h2>
            </div>
            {totalNotPaid > 0 ? (
              <Badge variant="default">{formatCurrency(totalNotPaid)}</Badge>
            ) : null}
          </div>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : null}
          {!isLoading && notPaid && notPaid.length > 0 ? (
            <NotPaidBillList data={notPaid} />
          ) : (
            <div className="p-4">{t('dashboard.noNotPaidBills')}</div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Dashboard

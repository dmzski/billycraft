import { Badge, Loader } from '@coco-ui/core'
import { getBillTotal } from '@/utils/bill'
import NotPaidBillList from './NotPaidBillList'
import TodoList from './TodoList'
import { BanknotesIcon, ExclamationTriangleIcon, PencilIcon } from '@heroicons/react/24/solid'
import { useAllBillsNotPaidQuery } from '@/queries/useAllBillsNotPaidQuery'
import { useAllTodosFinishedAfter } from '@/queries/useAllTodosFinishedAfter'
import { useI18n } from '@/i18n'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { useMemo } from 'react'

const DATE_OFFSET_TODOS = 24 * 60 * 60 * 1000 * 7 // 5 days

const Dashboard = () => {
  const { t } = useI18n()
  const formatCurrency = useFormatCurrency()
  const { data: notPaid, isLoading } = useAllBillsNotPaidQuery()
  const dateOffset = useMemo(() => new Date(Date.now() - DATE_OFFSET_TODOS), [])
  const { data: todos, reload } = useAllTodosFinishedAfter(dateOffset)

  const totalNotPaid =
    notPaid && Array.isArray(notPaid)
      ? Math.floor(notPaid.reduce((acc, bill) => acc + getBillTotal(bill), 0) * 100) / 100
      : 0

  const todoCount = todos?.filter(({ doneAt }) => !doneAt).length ?? 0

  return (
    <div>
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-center mb-8">
        <h1 className="text-3xl mb-4">{t('dashboard.title')}</h1>
        <div className="grid md:grid-cols-2 gap-2 justify-center">
          <Badge size="lg" variant={notPaid?.length ? 'error' : 'success'}>
            {notPaid?.length} {t('dashboard.notPaidBillsBadge')}
          </Badge>
          <Badge size="lg" variant={todoCount > 0 ? 'info' : 'success'}>
            {todoCount} {t('dashboard.todosBadge')}
          </Badge>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <PencilIcon className="w-5" />
            <h2 className="text-xl flex-grow">{t('dashboard.todos.title')}</h2>
            <Badge variant="warning" className="hidden md:flex gap-1">
              <ExclamationTriangleIcon className="w-4" />
              {t('dashboard.todosWarning')}
            </Badge>
          </div>
          <TodoList data={todos} onSubmitSuccess={reload} />
        </section>
        <hr />
        <section className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="flex text-xl gap-2">
              <BanknotesIcon className="w-5" />
              <h2>{t('dashboard.notPaidBills.title')}</h2>
            </div>
            {totalNotPaid > 0 ? <Badge variant="info">{formatCurrency(totalNotPaid)}</Badge> : null}
          </div>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : null}
          {!isLoading && notPaid && notPaid.length > 0 ? (
            <NotPaidBillList data={notPaid} />
          ) : (
            <div>{t('dashboard.noNotPaidBills')}</div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Dashboard

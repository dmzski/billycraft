import { Badge, Loader } from '@coco-ui/core'
import { BillApi } from '@/api/BillApi'
import { TodoApi } from '@/api/TodoApi'
import { getBillTotal } from '@/utils/bill'
import NotPaidBillList from './NotPaidBillList'
import TodoList from './TodoList'
import { useDataLoader } from '@scaleway/use-dataloader'
import { BanknotesIcon, ExclamationTriangleIcon, PencilIcon } from '@heroicons/react/24/solid'

const dateOffset = 24 * 60 * 60 * 1000 * 7 // 5 days

const Dashboard = () => {
  const { data: notPaid, isLoading } = useDataLoader(['bills', 'not-paid'], BillApi.findAllNotPaid)
  const { data: todos, reload } = useDataLoader(
    'todos-dashboard',
    () => TodoApi.findAllFinishedAfter(new Date(Date.now() - dateOffset)),
  )

  const totalNotPaid = notPaid && Array.isArray(notPaid) ? Math.floor(notPaid.reduce((acc, bill) => acc + getBillTotal(bill), 0) * 100) / 100 : 0

  const todoCount = todos?.filter(({ doneAt }) => !doneAt).length ?? 0

  return (
    <div>
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-center mb-8">
        <h1 className="text-3xl mb-4">Accueil</h1>
        <div className="grid md:grid-cols-2 gap-2 justify-center">
          <Badge variant={notPaid?.length ? 'error' : 'success'}>
            {notPaid?.length} factures impayées
          </Badge>
          <Badge variant={todoCount > 0 ? 'info' : 'success'}>{todoCount} Tâches à faire</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <PencilIcon />
            <h2 className="text-xl flex-grow">Vos tâches en cours</h2>
            <Badge variant="warning" className="hidden md:flex">
              <ExclamationTriangleIcon />
              &nbsp;Les tâches effectuées depuis une 1 semaine ne seront plus affichées
            </Badge>
          </div>
          <TodoList data={todos} onSubmitSuccess={() => reload()} />
        </section>
        <hr />
        <section className="flex flex-col gap-4">
          <div className='flex justify-between'>
          <div className="flex text-xl gap-2">
            <BanknotesIcon />
            <h2>Factures impayées</h2>
          </div>
          {totalNotPaid > 0 ? (
          <Badge variant="info">{totalNotPaid} €</Badge>

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
            <div>Aucun impayé</div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Dashboard

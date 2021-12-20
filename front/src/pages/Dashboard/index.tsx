import { Badge, Icon, Loader } from '@coco-ui/core'
import { BillApi } from 'api/BillApi'
import { TodoApi } from 'api/TodoApi'
import { useQuery } from 'react-query'
import NextAppointmentList from './NextAppointmentList'
import NotPaidBillList from './NotPaidBillList'
import TodoList from './TodoList'

const dateOffset = 24 * 60 * 60 * 1000 * 7 // 5 days

const Dashboard = (): JSX.Element => {
  const { data: notPaid, isLoading } = useQuery(['bills', 'not-paid'], BillApi.findAllNotPaid)
  const { data: todos, refetch } = useQuery(
    'todos-dashboard',
    () => TodoApi.findAllFinishedAfter(new Date(Date.now() - dateOffset)),
    {
      refetchOnWindowFocus: false,
    },
  )

  return (
    <div>
      <div className="flex flex-wrap justify-between">
        <h1 className="text-3xl mb-8">Accueil</h1>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span
              className={
                notPaid && notPaid.length > 0
                  ? 'text-background bg-error-700 p-2 rounded'
                  : 'p-2 bg-success-700 text-background rounded'
              }
            >
              {notPaid?.length} factures impayées
            </span>
          </div>
          <div>
            <span
              className={
                todos && todos.filter(({ doneAt }) => !doneAt).length > 0
                  ? 'text-background bg-info-700 p-2 rounded'
                  : 'p-2 bg-success-700 text-background rounded'
              }
            >
              {todos?.filter(({ doneAt }) => !doneAt).length} Tâches à faire
            </span>
          </div>
        </div>
      </div>
      <NextAppointmentList />
      <hr className="my-4" />

      <div className="flex items-center">
        <Icon className="mr-2" name="pencil" />
        <h2 className="text-xl flex-grow">Vos tâches en cours</h2>
        <div className="flex items-center ml-2 text-xs text-warning-600">
          <Icon size={14} name="exclamation" />
          &nbsp;Les tâches effectuées depuis une 1 semaine ne seront plus affichées
        </div>
      </div>
      <div className="mt-4 ml-4">
        <TodoList data={todos} onSubmitSuccess={() => refetch()} />
      </div>
      <hr className="my-10" />
      <div>
        <div className="flex text-xl mb-4">
          <Icon name="cash" className="mr-2" />
          <h2>Factures impayées</h2>
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
      </div>
    </div>
  )
}

export default Dashboard

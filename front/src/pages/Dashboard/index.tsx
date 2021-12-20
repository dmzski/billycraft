import { Icon } from '@coco-ui/core'
import NextAppointmentList from './NextAppointmentList'

import TodoList from './TodoList'

const Dashboard = (): JSX.Element => (
  <div>
    <h1 className="text-3xl">Accueil</h1>
    <div className="mt-10 flex justify-between items-center">
      <h2 className="text-xl">Vos tâches en cours</h2>
      <div className="flex items-center ml-2 text-xs text-warning-600">
        <Icon size={14} name="exclamation" />
        &nbsp;Les tâches effectuées depuis une 1 semaine ne seront plus affichées
      </div>
    </div>
    <div className="mt-6 ml-4">
      <TodoList />
    </div>
    <hr className="my-10" />
    <NextAppointmentList />
  </div>
)

export default Dashboard

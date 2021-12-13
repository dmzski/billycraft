import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from 'routes'
import QuoteTab from './QuoteTab'
import BillTab from './BillTab'
import TodoTab from './TodoTab'

const TABS = {
  QUOTES: `${ROUTES.HISTORY.path}/quotes`,
  BILLS: `${ROUTES.HISTORY.path}/bills`,
  TODOS: `${ROUTES.HISTORY.path}/todos`,
}

const History = (): JSX.Element => (
  <>
    <h2 className="text-3xl">Historique</h2>
    <div className="flex flex-col w-full justify-center items-center">
      <div className="mt-4 flex w-full justify-center items-center mb-4">
        <NavLink
          activeClassName="bg-primary-600 text-white"
          to={TABS.QUOTES}
          className="cursor-pointer hover:font-bold p-3 w-1/3 text-center shadow rounded"
        >
          Devis archivés
        </NavLink>
        <NavLink
          to={TABS.BILLS}
          activeClassName="bg-primary-600 text-white"
          className="cursor-pointer hover:font-bold p-3 w-1/3 mx-2 text-center shadow rounded"
        >
          Factures archivées
        </NavLink>
        <NavLink
          to={TABS.TODOS}
          activeClassName="bg-primary-600 text-white"
          className="cursor-pointer hover:font-bold p-3 w-1/3 text-center shadow rounded"
        >
          Tâches finies
        </NavLink>
      </div>
    </div>
    <Switch>
      <Route path={TABS.QUOTES}>
        <QuoteTab />
      </Route>
      <Route path={TABS.BILLS}>
        <BillTab />
      </Route>
      <Route path={TABS.TODOS}>
        <TodoTab />
      </Route>
      <Redirect to={TABS.QUOTES} />
    </Switch>
  </>
)

export default History

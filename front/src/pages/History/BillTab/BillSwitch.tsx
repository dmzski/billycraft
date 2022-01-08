import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { HISTORY_ROUTES } from '../constant'
import HistoryTab from './HistoryTab'
import RefusedTab from './RefusedTab'

const BILL_ROUTES = HISTORY_ROUTES.BILLS.routes
const BillSwitch = () => (
  <>
    <h1 className="text-2xl">Historique des factures</h1>
    <div className="grid md:grid-cols-2 mt-4 mb-4 gap-4">
      <NavLink
        activeClassName="bg-primary-600 text-white"
        to={BILL_ROUTES.ARCHIVED.path}
        className="cursor-pointer hover:font-bold p-3 text-center shadow rounded"
      >
        Factures archivées
      </NavLink>
      <NavLink
        activeClassName="bg-primary-600 text-white"
        to={BILL_ROUTES.REFUSED.path}
        className="cursor-pointer hover:font-bold p-3 text-center shadow rounded"
      >
        Factures refusées
      </NavLink>
    </div>
    <Switch>
      <Route path={BILL_ROUTES.ARCHIVED.path} component={HistoryTab} />
      <Route path={BILL_ROUTES.REFUSED.path} component={RefusedTab} />
      <Redirect to={BILL_ROUTES.ARCHIVED.path} />
    </Switch>
  </>
)

export default BillSwitch

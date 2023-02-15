import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { HISTORY_ROUTES } from '../constant'
import HistoryTab from './HistoryTab'
import RefusedTab from './RefusedTab'

const BILL_ROUTES = HISTORY_ROUTES.BILLS.routes
const BillSwitch = () => (
  <div className="flex flex-col gap-4">
    <h1 className="text-2xl">Historique des factures</h1>
    <div className="tabs tabs-boxed">
      <NavLink
        activeClassName="tab-active"
        to={BILL_ROUTES.ARCHIVED.path}
        className="tab flex-grow"
      >
        Factures archivées
      </NavLink>
      <NavLink activeClassName="tab-active" to={BILL_ROUTES.REFUSED.path} className="tab flex-grow">
        Factures refusées
      </NavLink>
    </div>
    <Switch>
      <Route path={BILL_ROUTES.ARCHIVED.path} component={HistoryTab} />
      <Route path={BILL_ROUTES.REFUSED.path} component={RefusedTab} />
      <Redirect to={BILL_ROUTES.ARCHIVED.path} />
    </Switch>
  </div>
)

export default BillSwitch

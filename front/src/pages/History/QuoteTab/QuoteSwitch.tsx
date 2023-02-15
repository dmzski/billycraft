import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { HISTORY_ROUTES } from '../constant'
import HistoryTab from './HistoryTab'
import RefusedTab from './RefusedTab'

const QUOTE_ROUTES = HISTORY_ROUTES.QUOTES.routes
const QuoteSwitch = () => (
  <div className="flex flex-col gap-4">
    <h1 className="text-2xl">Historique des devis</h1>
    <div className="tabs tabs-boxed">
      <NavLink
        activeClassName="tab-active"
        to={QUOTE_ROUTES.ARCHIVED.path}
        className="tab flex-grow"
      >
        Devis archivés
      </NavLink>
      <NavLink
        activeClassName="tab-active"
        to={QUOTE_ROUTES.REFUSED.path}
        className="tab flex-grow"
      >
        Devis refusés
      </NavLink>
    </div>
    <Switch>
      <Route path={QUOTE_ROUTES.ARCHIVED.path} component={HistoryTab} />
      <Route path={QUOTE_ROUTES.REFUSED.path} component={RefusedTab} />
      <Redirect to={QUOTE_ROUTES.ARCHIVED.path} />
    </Switch>
  </div>
)

export default QuoteSwitch

import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { HISTORY_ROUTES } from '../constant'
import HistoryTab from './HistoryTab'
import RefusedTab from './RefusedTab'

const QUOTE_ROUTES = HISTORY_ROUTES.QUOTES.routes
const QuoteSwitch = () => (
  <>
    <h1 className="text-2xl">Historique des devis</h1>
    <div className="grid md:grid-cols-2 mt-4 mb-4 gap-4">
      <NavLink
        activeClassName="bg-primary-600 text-white"
        to={QUOTE_ROUTES.ARCHIVED.path}
        className="cursor-pointer hover:font-bold p-3 text-center shadow rounded"
      >
        Devis archivés
      </NavLink>
      <NavLink
        activeClassName="bg-primary-600 text-white"
        to={QUOTE_ROUTES.REFUSED.path}
        className="cursor-pointer hover:font-bold p-3 text-center shadow rounded"
      >
        Devis refusés
      </NavLink>
    </div>
    <Switch>
      <Route path={QUOTE_ROUTES.ARCHIVED.path} component={HistoryTab} />
      <Route path={QUOTE_ROUTES.REFUSED.path} component={RefusedTab} />
      <Redirect to={QUOTE_ROUTES.ARCHIVED.path} />
    </Switch>
  </>
)

export default QuoteSwitch

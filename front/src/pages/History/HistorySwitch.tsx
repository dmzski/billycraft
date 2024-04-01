import { Redirect, Route, Switch } from 'react-router-dom'
import BillSwitch from './BillTab/BillSwitch'
import { HISTORY_ROUTES } from './constant'
import QuoteSwitch from './QuoteTab/QuoteSwitch'
import TodoTab from './TodoTab'

const HistorySwitch = () => (
  <Switch>
    <Route path={HISTORY_ROUTES.QUOTES.path} component={QuoteSwitch} />
    <Route path={HISTORY_ROUTES.BILLS.path} component={BillSwitch} />
    <Route path={HISTORY_ROUTES.TODOS.path} component={TodoTab} />
    <Route render={() => <Redirect to={HISTORY_ROUTES.QUOTES.path} />} />
  </Switch>
)

export default HistorySwitch

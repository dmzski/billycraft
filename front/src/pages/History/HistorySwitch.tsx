import { Redirect, Route, Switch } from 'react-router-dom'
import { HISTORY_ROUTES } from './constant'
import TodoTab from './TodoTab'

const HistorySwitch = () => (
  <Switch>
    <Route path={HISTORY_ROUTES.TODOS.path()} component={TodoTab} />
    <Route render={() => <Redirect to={HISTORY_ROUTES.TODOS.path()} />} />
  </Switch>
)

export default HistorySwitch

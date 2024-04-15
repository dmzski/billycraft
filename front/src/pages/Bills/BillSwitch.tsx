import { Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import Bill from '.'
import { Edit } from './Edit/Edit'
import { Create } from './Create/Create'
import { Overview } from './Overview/Overview'

const BillSwitch = () => (
  <Switch>
    <Route path={ROUTES.BILLS.path()} exact={ROUTES.BILLS.exact} component={Bill} />
    <Route path={ROUTES.BILL_EDIT.path()} component={Edit} />
    <Route path={ROUTES.BILL_ADD.path()} component={Create} />
    <Route path={ROUTES.BILL_OVERVIEW.path()} component={Overview} />
    <Route render={() => <Redirect to={ROUTES.BILLS.path()} />} />
  </Switch>
)

export default BillSwitch

import { Route, Switch } from 'react-router-dom'
import { ROUTES } from 'routes'
import Bill from '.'
import BillForm from './Form'

const BillSwitch = () => (
  <Switch>
    <Route path={ROUTES.BILLS.path} exact={ROUTES.BILLS.exact} component={Bill} />
    <Route path={ROUTES.BILL_FORM.path} component={BillForm} />
  </Switch>
)

export default BillSwitch

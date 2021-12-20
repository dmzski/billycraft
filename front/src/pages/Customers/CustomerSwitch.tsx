import { Route, Switch } from 'react-router-dom'
import { ROUTES } from 'routes'
import Customer from '.'

const CustomerSwitch = () => (
  <Switch>
    <Route path={ROUTES.CUSTOMERS.path} exact={ROUTES.CUSTOMERS.exact} component={Customer} />
    <Route path={ROUTES.CUSTOMER_FORM.path} component={Customer} />
  </Switch>
)

export default CustomerSwitch

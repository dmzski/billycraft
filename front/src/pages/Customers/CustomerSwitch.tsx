import { Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import Customer from '.'
import CustomerForm from './Form'

const CustomerSwitch = () => (
  <Switch>
    <Route path={ROUTES.CUSTOMERS.path()} exact={ROUTES.CUSTOMERS.exact} component={Customer} />
    <Route path={ROUTES.CUSTOMER_EDIT.path()} component={CustomerForm} />
    <Route path={ROUTES.CUSTOMER_ADD.path()} component={CustomerForm} />
  </Switch>
)

export default CustomerSwitch

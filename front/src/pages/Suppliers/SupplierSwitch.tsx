import { Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import Supplier from '.'

const SupplierSwitch = () => (
  <Switch>
    <Route path={ROUTES.SUPPLIERS.path} exact={ROUTES.SUPPLIERS.exact} component={Supplier} />
    <Route path={ROUTES.SUPPLIERS_FORM.path} component={Supplier} />
  </Switch>
)

export default SupplierSwitch

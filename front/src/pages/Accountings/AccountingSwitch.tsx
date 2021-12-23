import { Route, Switch } from 'react-router-dom'
import { ROUTES } from 'routes'
import OutgoingsSwitch from './Outgoings/OutgoingsSwitch'
import Reports from './Reports'

const AccountingSwitch = () => (
  <Switch>
    <Route path={ROUTES.ACCOUNTINGS.routes?.REPORTS.path} component={Reports} />
    <Route path={ROUTES.ACCOUNTINGS.routes?.OUTGOINGS.path} component={OutgoingsSwitch} />
  </Switch>
)

export default AccountingSwitch

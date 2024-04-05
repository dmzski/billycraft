import { Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import OutgoingsSwitch from './Outgoings/OutgoingsSwitch'
import ReportsSwitch from './Reports/ReportsSwitch'

const AccountingSwitch = () => (
  <Switch>
    <Route path={ROUTES.ACCOUNTINGS.routes?.REPORTS.path} component={ReportsSwitch} />
    <Route path={ROUTES.ACCOUNTINGS.routes?.OUTGOINGS.path} component={OutgoingsSwitch} />
  </Switch>
)

export default AccountingSwitch

import { Redirect, Route, Switch } from 'react-router-dom'
import BillCustomizationPage from './BillCustomizationPage'
import { SETTINGS_ROUTES } from './constants'
import MyCompanyPage from './MyCompanyPage'
import QuoteCustomizationPage from './QuoteCustomizationPage'

const SettingsSwitch = () => (
  <Switch>
    <Route path={SETTINGS_ROUTES.MY_COMPANY.path()} component={MyCompanyPage} />
    <Route path={SETTINGS_ROUTES.BILL_CUSTOMIZATION.path()} component={BillCustomizationPage} />
    <Route path={SETTINGS_ROUTES.QUOTE_CUSTOMIZATION.path()} component={QuoteCustomizationPage} />
    <Redirect to={SETTINGS_ROUTES.MY_COMPANY.path()} />
  </Switch>
)

export default SettingsSwitch

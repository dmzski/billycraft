import { Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { useUser } from '@/providers/UserProvider'
import { useAuth } from '@/providers/AuthProvider'
import { PageLoader } from '@/components/PageLoader'
import Dashboard from './Dashboard'
import Layout from '../layout/Layout'
import Onboarding from './Onboarding/Onboarding'
import ProductsPage from './Products'
import Settings from './Settings'
import History from './History'
import AccountingSwitch from './Accountings/AccountingSwitch'
import QuoteSwitch from './Quotes/QuoteSwitch'
import BillSwitch from './Bills/BillSwitch'
import CustomerSwitch from './Customers/CustomerSwitch'
import SupplierSwitch from './Suppliers/SupplierSwitch'
import { Login } from './Auth/Login'
import { Register } from './Auth/Register'



const PrivateSwitch = () => {
  const { organization, user } = useUser()
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return null
  }


  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path={ROUTES.LOGIN.path} component={Login} />
        <Route path={ROUTES.REGISTER.path} component={Register} />
        <Route render={() => <Redirect to={ROUTES.LOGIN.path} />} />
      </Switch>
    )
  }

  if (!user || user.companyId && !organization) {
    return (
      <div className="flex justify-center items-center h-screen max-w-screen">
        <div className='w-1/2'>
          <PageLoader />
        </div>
      </div>
    )
  }

  if (user && user.companyId === null) {
    return (
      <Switch>
        <Route path={ROUTES.ONBOARDING.path} component={Onboarding} />
        <Route render={() =>
          <Redirect to={ROUTES.ONBOARDING.path} />
        } />
      </Switch>

    )
  }
  return (
    <Layout>
      <Switch>
        <Route path={ROUTES.ACCOUNTINGS.path} component={AccountingSwitch} />
        <Route path={ROUTES.QUOTES.path} component={QuoteSwitch} />
        <Route path={ROUTES.BILLS.path} component={BillSwitch} />
        <Route path={ROUTES.CUSTOMERS.path} component={CustomerSwitch} />
        <Route path={ROUTES.SUPPLIERS.path} component={SupplierSwitch} />
        <Route path={ROUTES.DASHBOARD.path} component={Dashboard} />
        <Route
          path={ROUTES.PRODUCTS.path}
          exact={ROUTES.PRODUCTS.exact}
          component={ProductsPage}
        />
        <Route path={ROUTES.SETTINGS.path} exact={ROUTES.SETTINGS.exact} component={Settings} />
        <Route path={ROUTES.HISTORY.path} exact={ROUTES.HISTORY.exact} component={History} />
        <Route render={() =>
          <Redirect to={ROUTES.DASHBOARD.path} />
        } />
      </Switch>
    </Layout>
  )
}

export default PrivateSwitch

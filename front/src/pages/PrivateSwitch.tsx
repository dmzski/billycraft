import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { ROUTES } from 'routes'
import { useEffect } from 'react'
import { useUser } from 'providers/UserProvider'
import { useAuth } from 'providers/AuthProvider'
import { PageLoader } from 'components/PageLoader'
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



const PrivateSwitch = (): JSX.Element => {
  const user = useUser()
  const { location, push } = useHistory()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (user.user && isAuthenticated) {
      if (!user.user.companyId && location.pathname !== ROUTES.ONBOARDING.path) {
        push(ROUTES.ONBOARDING.path)
      }
      if (user.user.companyId && location.pathname === ROUTES.ONBOARDING.path) {
        push(ROUTES.DASHBOARD.path)
      }
    }
  }, [user, push, location, isAuthenticated])

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path={ROUTES.LOGIN.path} component={Login} />
        <Route path={ROUTES.REGISTER.path} component={Register} />
        <Route render={() => <Redirect to={ROUTES.LOGIN.path} />} />
      </Switch>
    )
  }

  if (!user.user) {
    return (
      <div className="flex justify-center items-center h-screen max-w-screen">
        <div className='w-1/2'>
          <PageLoader />
        </div>
      </div>
    )
  }

  if (user.user && user.user.companyId === null) {
    return (
      <Switch location={location}>
        <Route path={ROUTES.ONBOARDING.path} component={Onboarding} />
        <Route render={() =>
          <Redirect to={ROUTES.ONBOARDING.path} />
        } />
      </Switch>

    )
  }
  return (
    <Layout>
      <Switch location={location}>
        <Route path={ROUTES.ACCOUNTINGS.path}>
          <AccountingSwitch />
        </Route>
        <Route path={ROUTES.QUOTES.path}>
          <QuoteSwitch />
        </Route>
        <Route path={ROUTES.BILLS.path}>
          <BillSwitch />
        </Route>
        <Route path={ROUTES.CUSTOMERS.path}>
          <CustomerSwitch />
        </Route>
        <Route path={ROUTES.SUPPLIERS.path}>
          <SupplierSwitch />
        </Route>
        <Route path={ROUTES.DASHBOARD.path} component={Dashboard} />
        <Route
          path={ROUTES.PRODUCTS.path}
          exact={ROUTES.PRODUCTS.exact}
          component={ProductsPage}
        />
        <Route path={ROUTES.SETTINGS.path} exact={ROUTES.SETTINGS.exact} component={Settings} />
        <Route path={ROUTES.HISTORY.path} exact={ROUTES.HISTORY.exact} component={History} />
        <Route>
          <Redirect to={ROUTES.DASHBOARD.path} />
        </Route>
      </Switch>
    </Layout>
  )
}

export default PrivateSwitch

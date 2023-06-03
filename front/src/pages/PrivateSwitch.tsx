import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom'
import Loader from 'components/Loader'
import { ROUTES } from 'routes'
import { useEffect } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { useUser } from 'providers/UserProvider'
import Dashboard from './Dashboard'
import Layout from '../layout/Layout'
import Onboarding from './Onboarding'
import ProductsPage from './Products'
import Settings from './Settings'
import History from './History'
import AccountingSwitch from './Accountings/AccountingSwitch'
import QuoteSwitch from './Quotes/QuoteSwitch'
import BillSwitch from './Bills/BillSwitch'
import CustomerSwitch from './Customers/CustomerSwitch'
import SupplierSwitch from './Suppliers/SupplierSwitch'

const PrivateSwitch = (): JSX.Element => {
  const user = useUser()
  const location = useLocation()
  const history = useHistory()
  const { keycloak } = useKeycloak()

  useEffect(() => {
    if (user.user && keycloak.authenticated) {
      if (!user.user.companyId && history.location.pathname !== ROUTES.ONBOARDING_COMPANY.path) {
        history.push(ROUTES.ONBOARDING_COMPANY.path)
      }
      if (user.user.companyId && history.location.pathname === ROUTES.ONBOARDING_COMPANY.path) {
        history.push(ROUTES.DASHBOARD.path)
      }
    }
  }, [user, history, keycloak.authenticated])

  console.log(user.user)

  return keycloak.authenticated ? (
    <>
      {!user.user ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
          <span className="ml-3">Chargement de vos données...</span>
        </div>
      ) : null}
      {user.user && user.user.companyId === null ? (
        <Switch location={location}>
          <Route path={ROUTES.ONBOARDING_COMPANY.path}>
            <Onboarding />
          </Route>
          <Route>
            <Redirect to={ROUTES.ONBOARDING_COMPANY.path} />
          </Route>
        </Switch>
      ) : null}
      {user.user && user.user.companyId !== null ? (
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
      ) : null}
    </>
  ) : (
    <div className="flex justify-center items-center h-full">
      <Loader />
      <span className="ml-1">Initialisation</span>
    </div>
  )
}

export default PrivateSwitch

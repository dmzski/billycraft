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
import { ErrorBoundary } from '@/components/ErrorBoundary'

type PathComponentTuple = [string, () => JSX.Element]

const UNAUTHENTIFIED_ROUTES: PathComponentTuple[] = [
  [ROUTES.LOGIN.path(), Login],
  [ROUTES.REGISTER.path(), Register],
]

const ONBOARDING_ROUTES: PathComponentTuple[] = [[ROUTES.ONBOARDING.path(), Onboarding]]

const APP_ROUTES: PathComponentTuple[] = [
  [ROUTES.ACCOUNTINGS.path(), AccountingSwitch],
  [ROUTES.QUOTES.path(), QuoteSwitch],
  [ROUTES.BILLS.path(), BillSwitch],
  [ROUTES.CUSTOMERS.path(), CustomerSwitch],
  [ROUTES.SUPPLIERS.path(), SupplierSwitch],
  [ROUTES.DASHBOARD.path(), Dashboard],
  [ROUTES.PRODUCTS.path(), ProductsPage],
  [ROUTES.SETTINGS.path(), Settings],
  [ROUTES.HISTORY.path(), History],
]

export const MainSwitch = () => {
  const { organization, user } = useUser()
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        {UNAUTHENTIFIED_ROUTES.map(([path, RouteComponent]) => (
          <Route
            key={path}
            path={path}
            render={() => (
              <ErrorBoundary>
                <RouteComponent />
              </ErrorBoundary>
            )}
          />
        ))}
        <Route render={() => <Redirect to={ROUTES.LOGIN.path()} />} />
      </Switch>
    )
  }

  if (!user || (user.companyId && !organization)) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="w-1/2">
          <PageLoader />
        </div>
      </div>
    )
  }

  if (user && user.companyId === null) {
    return (
      <Switch>
        {ONBOARDING_ROUTES.map(([path, RouteComponent]) => (
          <Route
            key={path}
            path={path}
            render={() => (
              <ErrorBoundary>
                <RouteComponent />
              </ErrorBoundary>
            )}
          />
        ))}
        <Route render={() => <Redirect to={ROUTES.ONBOARDING.path()} />} />
      </Switch>
    )
  }
  return (
    <Layout>
      <ErrorBoundary>
        <Switch>
          {APP_ROUTES.map(([path, RouteComponent]) => (
            <Route key={path} path={path} render={() => <RouteComponent />} />
          ))}
          <Route render={() => <Redirect to={ROUTES.DASHBOARD.path()} />} />
        </Switch>
      </ErrorBoundary>
    </Layout>
  )
}

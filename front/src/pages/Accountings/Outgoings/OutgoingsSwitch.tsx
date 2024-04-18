import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import FormPage from './FormPage'
import Details from './Details'
import ListPage from './ListPage'
import Overview from './Overview'
import { useI18n } from '@/i18n'
import { ReactNode } from 'react'

const { routes } = ROUTES.ACCOUNTINGS.routes.OUTGOINGS

type OutgoingLayoutProps = {
  children: ReactNode
}

const OutgoingLayout = ({ children }: OutgoingLayoutProps) => {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl mb-4">{t('accounting.outgoings.title')}</h1>
        <div className="tabs tabs-bordered">
          <NavLink activeClassName="tab-active" to={routes.OVERVIEW.path} className="tab flex-grow">
            {t('accounting.outgoings.links.overview')}
          </NavLink>
          <NavLink activeClassName="tab-active" to={routes.LIST.path} className="tab flex-grow">
            {t('accounting.outgoings.links.list')}
          </NavLink>
        </div>
      </div>
      {children}
    </div>
  )
}
const OutgoingsSwitch = () => (
  <Switch>
    <Route
      path={routes.OVERVIEW.path()}
      render={() => (
        <OutgoingLayout>
          <Overview />
        </OutgoingLayout>
      )}
    />
    <Route
      path={routes.LIST.path()}
      exact={routes.LIST.exact}
      render={() => (
        <OutgoingLayout>
          <ListPage />
        </OutgoingLayout>
      )}
    />
    <Route path={routes.FORM.path()} component={FormPage} />
    <Route path={routes.DETAILS.path()} component={Details} />
    <Route>
      <Redirect to={routes.OVERVIEW.path()} />
    </Route>
  </Switch>
)

export default OutgoingsSwitch

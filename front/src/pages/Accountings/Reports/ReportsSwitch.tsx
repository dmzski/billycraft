import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import DetailsPage from './DetailsPage'
import ListPage from './ListPage'
import OverviewPage from './OverviewPage'
import { useI18n } from '@/i18n'

const { routes, path } = ROUTES.ACCOUNTINGS.routes.REPORTS

const Heading = () => {
  const {t} = useI18n()
  return (
  <div className="flex flex-col gap-4 mb-4">
    <h1 className="text-3xl">Rapports d&apos;activité</h1>
    <div className="tabs tabs-boxed flex">
      <NavLink activeClassName="tab-active" to={routes.OVERVIEW.path} className="tab flex-grow">
        {t('accounting.heaging.overview')}
      </NavLink>
      <NavLink activeClassName="tab-active" to={routes.LIST.path} className="tab flex-grow">
        {t('accounting.heaging.list')}
      </NavLink>
    </div>
  </div>
)}

const ReportsSwitch = () => (
  <Switch>
    <Route path={routes.OVERVIEW.path}>
      <Heading />
      <OverviewPage />
    </Route>
    <Route path={routes.LIST.path} exact={routes.LIST.exact}>
      <Heading />
      <ListPage />
    </Route>
    <Route path={routes.DETAILS.path}>
      <DetailsPage />
    </Route>
    <Route path={path}>
      <Redirect to={routes.OVERVIEW.path} />
    </Route>
  </Switch>
)

export default ReportsSwitch

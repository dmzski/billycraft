import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import DetailsPage from './DetailsPage'
import ListPage from './ListPage'
import OverviewPage from './OverviewPage'
import { useI18n } from '@/i18n'
import { ReactNode } from 'react'

const { routes } = ROUTES.ACCOUNTINGS.routes.REPORTS

type ReportLayoutProps = {
  children: ReactNode
}

const ReportLayout = ({ children }: ReportLayoutProps) => {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-10 mb-4">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl">{t('accounting.reports.title')}</h1>
        <div className="tabs tabs-bordered">
          <NavLink activeClassName="tab-active" to={routes.OVERVIEW.path} className="tab flex-grow">
            {t('accounting.reports.heading.overview')}
          </NavLink>
          <NavLink activeClassName="tab-active" to={routes.LIST.path} className="tab flex-grow">
            {t('accounting.reports.heading.list')}
          </NavLink>
        </div>
      </div>
      {children}
    </div>
  )
}

const ReportsSwitch = () => (
  <Switch>
    <Route path={routes.OVERVIEW.path()}>
      <ReportLayout>
        <OverviewPage />
      </ReportLayout>
    </Route>
    <Route path={routes.LIST.path()} exact={routes.LIST.exact}>
      <ReportLayout>
        <ListPage />
      </ReportLayout>
    </Route>
    <Route path={routes.DETAILS.path()}>
      <DetailsPage />
    </Route>
    <Route>
      <Redirect to={routes.OVERVIEW.path()} />
    </Route>
  </Switch>
)

export default ReportsSwitch

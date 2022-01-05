import React from 'react'
import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from 'routes'
import DetailsPage from './DetailsPage'
import ListPage from './ListPage'
import OverviewPage from './OverviewPage'

const { routes, path } = ROUTES.ACCOUNTINGS.routes.REPORTS

const Heading = (): JSX.Element => (
  <>
    <h1 className="text-3xl mb-4">Rapports d&apos;activité</h1>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <NavLink
        activeClassName="bg-primary-700 text-white"
        to={routes.OVERVIEW.path}
        className="shadow rounded py-2 flex items-center justify-center"
      >
        Vue d&apos;ensemble
      </NavLink>
      <NavLink
        activeClassName="bg-primary-700 text-white"
        to={routes.LIST.path}
        className="shadow rounded text-center py-2 flex items-center justify-center"
      >
        Tous les rapports d&apos;activité
      </NavLink>
    </div>
  </>
)

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

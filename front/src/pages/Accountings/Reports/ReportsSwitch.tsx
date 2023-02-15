import React from 'react'
import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from 'routes'
import DetailsPage from './DetailsPage'
import ListPage from './ListPage'
import OverviewPage from './OverviewPage'

const { routes, path } = ROUTES.ACCOUNTINGS.routes.REPORTS

const Heading = (): JSX.Element => (
  <div className="flex flex-col gap-4 mb-4">
    <h1 className="text-3xl">Rapports d&apos;activité</h1>
    <div className="tabs tabs-boxed flex">
      <NavLink activeClassName="tab-active" to={routes.OVERVIEW.path} className="tab flex-grow">
        Vue d&apos;ensemble
      </NavLink>
      <NavLink activeClassName="tab-active" to={routes.LIST.path} className="tab flex-grow">
        Tous les rapports d&apos;activité
      </NavLink>
    </div>
  </div>
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

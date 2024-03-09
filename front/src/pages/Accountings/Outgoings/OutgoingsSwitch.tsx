import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import FormPage from './FormPage'
import Details from './Details'
import ListPage from './ListPage'
import Overview from './Overview'

const { routes, path } = ROUTES.ACCOUNTINGS.routes.OUTGOINGS

const Heading = () => (
  <>
    <h1 className="text-3xl mb-4">Livrets d&apos;achats</h1>
    <div className="tabs tabs-boxed">
      <NavLink activeClassName="tab-active" to={routes.OVERVIEW.path} className="tab flex-grow">
        Vue d&apos;ensemble
      </NavLink>
      <NavLink activeClassName="tab-active" to={routes.LIST.path} className="tab flex-grow">
        Tous les livrets d&apos;achats
      </NavLink>
    </div>
  </>
)
const OutgoingsSwitch = () => (
  <Switch>
    <Route path={routes.OVERVIEW.path}>
      <Heading />
      <Overview />
    </Route>
    <Route path={routes.LIST.path} exact={routes.LIST.exact}>
      <Heading />
      <ListPage />
    </Route>
    <Route path={routes.FORM.path} component={FormPage} />
    <Route path={routes.DETAILS.path} component={Details} />
    <Route path={path}>
      <Redirect to={routes.OVERVIEW.path} />
    </Route>
  </Switch>
)

export default OutgoingsSwitch

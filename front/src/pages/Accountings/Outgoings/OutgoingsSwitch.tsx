import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from 'routes'
import ListPage from './ListPage'
import Overview from './Overview'

const { routes } = ROUTES.ACCOUNTINGS.routes.OUTGOINGS

const OutgoingsSwitch = () => (
  <div>
    <h1 className="text-3xl mb-4">Livrets d&apos;achats</h1>
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
        Tous les livrets d&apos;achats
      </NavLink>
    </div>
    <Switch>
      <Route path={routes.OVERVIEW.path} component={Overview} />
      <Route path={routes.LIST.path} component={ListPage} />
      <Route path={ROUTES.ACCOUNTINGS.routes?.OUTGOINGS.path}>
        <Redirect to={routes.OVERVIEW.path} />
      </Route>
    </Switch>
  </div>
)

export default OutgoingsSwitch

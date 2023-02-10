import { Button, Icon, Link } from '@coco-ui/core'
import { IconName } from '@coco-ui/core/dist/components/Icon'
import { useKeycloak } from '@react-keycloak/web'
import { NavLink } from 'react-router-dom'
import { Route, ROUTES } from 'routes'
import MenuItem from './MenuItem'

const menuRoutes = [
  ROUTES.DASHBOARD,
  ROUTES.QUOTES,
  ROUTES.BILLS,
  ROUTES.CUSTOMERS,
  ROUTES.PRODUCTS,
  ROUTES.HISTORY,
  ROUTES.SETTINGS,
  ROUTES.SUPPLIERS,
  ROUTES.ACCOUNTINGS,
] as Route[]

type MenuProps = {
  route: Route
}
const Menu = ({ route }: MenuProps): JSX.Element => (
  <>
    <li className="menu-title mt-2">
      <span className="flex items-center">
        {route.icon ? <Icon name={route.icon} className="mr-1" /> : null}
        {route.title}
      </span>
    </li>
    {Object.values(route.routes ?? {}).map(subRoute => (
      <li className="bg-base-200">
        <NavLink activeClassName="active" key={subRoute.path} to={subRoute.path}>
          {subRoute.title}
        </NavLink>
      </li>
    ))}
  </>
)

const SideBarMenu = (): JSX.Element => {
  const { keycloak } = useKeycloak()

  const logout = () => {
    keycloak.logout()
  }

  return (
    <ul className="menu">
      {menuRoutes
        .sort((routeA, routeB) => routeA.title.localeCompare(routeB.title))
        .map(route =>
          !route.routes ? (
            <MenuItem
              key={route.path}
              text={route.title}
              icon={route.icon as IconName}
              path={route.path}
            />
          ) : (
            <Menu route={route} />
          ),
        )}
      <li>
        <Button className="mt-8" variant="error" type="button" outline onClick={logout}>
          <Icon name="logout" type="outline" />
          &nbsp; Déconnexion
        </Button>
      </li>
    </ul>
  )
}

export default SideBarMenu

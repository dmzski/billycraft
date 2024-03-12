import { Button } from '@coco-ui/core'
import { useAuth } from '@/providers/AuthProvider'
import { NavLink } from 'react-router-dom'
import { Route, ROUTES } from '@/routes'
import MenuItem from './MenuItem'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid'

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
const Menu = ({ route }: MenuProps) => {
  return (
    <li>
      <details>
        <summary>
          {route.title}
        </summary>
        <ul>
          {Object.values(route.routes ?? {}).map(subRoute => (
            <li key={`submenu-${subRoute.path}-${subRoute.title}`}>
              <NavLink activeClassName="active" to={subRoute.path}>
                {subRoute.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </details>
    </li>
  )
}

const SideBarMenu = () => {
  const { logout } = useAuth()

  return (
    <div className="flex flex-col h-full gap-8">
      <ul className="menu flex-grow">
        {menuRoutes
          .sort((routeA, routeB) => routeA.title.localeCompare(routeB.title))
          .map(route =>
            !route.routes ? (
              <MenuItem
                key={route.path + route.title}
                text={route.title}
                path={route.path}
                icon={route.icon}
              />
            ) : (
              <Menu key={route.path} route={route} />
            ),
          )}
      </ul>
      <ul className='menu'>
        <li>
          <Button className="flex gap-2" variant="error" type="button" outline onClick={logout}>
            <ArrowRightStartOnRectangleIcon className='w-5' />
            Déconnexion
          </Button>
        </li>
      </ul>
    </div>
  )
}

export default SideBarMenu

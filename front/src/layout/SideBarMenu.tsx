import { Button, Icon } from '@coco-ui/core'
import { IconName } from '@coco-ui/core/dist/components/Icon'
import { useKeycloak } from '@react-keycloak/web'
import clsx from 'clsx'
import { useState } from 'react'
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
const Menu = ({ route }: MenuProps): JSX.Element => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(current => !current)
  }
  return (
    <li className={clsx('collapse collapse-arrow flex', open ? 'collapse-open' : 'collapse-close')}>
      <button
        onClick={handleOpen}
        type="button"
        className="appearance-none collapse-title flex items-center gap-6 min-h-0"
      >
        {route.icon ? <Icon name={route.icon} /> : null}
        {route.title}
      </button>
      <div className="collapse-content bg-base-200 flex p-0">
        <ul className="menu flex-grow">
          {Object.values(route.routes ?? {}).map(subRoute => (
            <li>
              <NavLink activeClassName="active" key={subRoute.path} to={subRoute.path}>
                {subRoute.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

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

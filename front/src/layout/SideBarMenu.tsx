import { Button } from '@coco-ui/core'
import clsx from 'clsx'
import { useAuth } from '@/providers/AuthProvider'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Route, ROUTES } from '@/routes'
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
const Menu = ({ route }: MenuProps) => {
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

const SideBarMenu = () => {
  const {logout} = useAuth()

  return (
    <div className="flex flex-col h-full gap-8">
      <ul className="menu flex-grow">
        {menuRoutes
          .sort((routeA, routeB) => routeA.title.localeCompare(routeB.title))
          .map(route =>
            !route.routes ? (
              <MenuItem
                key={route.path}
                text={route.title}
                path={route.path}
              />
            ) : (
              <Menu route={route} />
            ),
          )}
      </ul>
      <Button className="rounded-none flex gap-2 items-center" block variant="error" type="button" outline onClick={logout}>
        Déconnexion
      </Button>
    </div>
  )
}

export default SideBarMenu

import { Icon } from '@coco-ui/core'
import { IconName } from '@coco-ui/core/dist/components/Icon'
import clsx from 'clsx'
import { useState } from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import { Route, ROUTES } from 'routes'
import MenuItem from './MenuItem'

const menuRoutes = [
  ROUTES.DASHBOARD,
  ROUTES.CALENDAR,
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
  const match = useRouteMatch({
    path: route.path,
  })
  const [open, setOpen] = useState<boolean>(!match)

  return (
    <div className={clsx('flex flex-col cursor-pointer select-none text-gray-600')}>
      <button
        onClick={() => setOpen(current => !current)}
        type="button"
        className={clsx('appearance-none flex py-2 pl-4 pr-2 border-r-4', {
          'border-primary-600 font-bold bg-primary-200 text-primary-600': match,
          'bg-white border-white hover:border-primary-100 hover:bg-primary-100': !match,
        })}
      >
        {route.icon ? <Icon name={route.icon} /> : null}
        <div className="ml-2 text-left flex-grow">{route.title}</div>
        <Icon name={open ? 'chevron-down' : 'chevron-up'} />
      </button>
      <div className={clsx('overflow-hidden bg-gray-100', { 'h-0': open })}>
        {Object.values(route.routes ?? {}).map(subRoute => (
          <NavLink
            activeClassName="text-primary-700"
            className="pl-8 block py-2 hover:bg-primary-100"
            key={subRoute.path}
            to={subRoute.path}
          >
            {subRoute.title}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

const SideBarMenu = (): JSX.Element => (
  <>
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
  </>
)

export default SideBarMenu

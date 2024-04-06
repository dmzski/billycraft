import { Button } from '@coco-ui/core'
import { useAuth } from '@/providers/AuthProvider'
import { Route, ROUTES } from '@/routes'
import MenuItem from './MenuItem'
import { ArrowRightStartOnRectangleIcon, LifebuoyIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'
import { SUPPORT_EMAIL } from '@/constants/global'

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
      <span className='menu-title'>{route.title}</span>
      <ul>
        {Object.values(route.routes ?? {}).map(subRoute => (
          <MenuItem path={subRoute.path} key={`submenu-${subRoute.path}-${subRoute.title}`} text={subRoute.title} />
        ))}
      </ul>
    </li>
  )
}

const SideBarMenu = () => {
  const { logout } = useAuth()
  const { t } = useI18n()

  return (
    <div className="flex flex-col h-full gap-8">
      <ul className="menu flex-grow gap-1">
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
      <ul className="menu gap-1">
        <li>
          <a className="link link-primary flex items-center justify-center" href={`mailto:${SUPPORT_EMAIL}`}><LifebuoyIcon className='w-5' /> {t('contactSupport')}</a>
        </li>
        <li>
          <Button className="flex gap-2" variant="error" type="button" outline onClick={logout}>
            <ArrowRightStartOnRectangleIcon className="w-5" />
            {t('logout')}
          </Button>
        </li>
      </ul>
    </div>
  )
}

export default SideBarMenu

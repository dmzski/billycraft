import { Button } from '@coco-ui/core'
import { useAuth } from '@/providers/AuthProvider'
import { ROUTES } from '@/routes'
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
  ROUTES.SUPPLIERS,
  ROUTES.ACCOUNTINGS,
  ROUTES.HISTORY,
  ROUTES.SETTINGS,
] as const

type MenuProps = {
  route: (typeof menuRoutes)[number]
}
const Menu = ({ route }: MenuProps) => {
  const { t } = useI18n()
  return (
    <li>
      <span className="menu-title">{t(`heads.${route.id}`)}</span>
      <ul>
        {'routes' in route
          ? Object.values(route.routes ?? {}).map(subRoute => (
              <MenuItem path={subRoute.path()} id={subRoute.id} key={`submenu-${subRoute.path}`} />
            ))
          : null}
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
        {menuRoutes.map(route =>
          'routes' in route ? (
            <Menu key={route.path()} route={route} />
          ) : (
            <MenuItem key={route.path()} id={route.id} path={route.path()} />
          ),
        )}
      </ul>
      <ul className="menu gap-1">
        <li>
          <a
            className="link link-primary flex items-center justify-center"
            href={`mailto:${SUPPORT_EMAIL}`}
          >
            <LifebuoyIcon className="w-5" /> {t('contactSupport')}
          </a>
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

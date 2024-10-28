import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
  Avatar,
} from '@coco-ui/core'
import { useUser } from '@/providers/UserProvider'
import { ROUTES, RouteId } from '@/routes'
import { Link, useRouteMatch } from 'react-router-dom'
import { useI18n } from '@/i18n'

const menuRoutes = [
  ROUTES.DASHBOARD,
  ROUTES.QUOTES,
  ROUTES.BILLS,
  ROUTES.CUSTOMERS,
  ROUTES.SUPPLIERS,
  ROUTES.PRODUCTS,
  ROUTES.ACCOUNTINGS,
  ROUTES.HISTORY,
  ROUTES.SETTINGS,
] as const

type AppSidebarMenuItemsProps = {
  path: string
  id: RouteId
  exact: boolean
}
const AppSidebarMenuItem = ({ path, id, exact }: AppSidebarMenuItemsProps) => {
  const { t } = useI18n()
  const match = useRouteMatch({
    path,
    exact,
  })
  const { isMobile, setOpenMobile } = useSidebar()

  const onClickHandler = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={onClickHandler} asChild isActive={!!match}>
        <Link to={path}>{t(`heads.${id}`)}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { t } = useI18n()
  const { organization } = useUser()

  return (
    <Sidebar side="left" variant="floating" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-4 py-4">
          {organization ? (
            <Avatar src={organization?.logo} alt={organization.name} />
          ) : (
            <Avatar alt="?" />
          )}
          <div className="flex flex-wrap leading-none">
            <span className="font-semibold">{organization?.name}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto">
        {/* We create a SidebarGroup for each parent. */}
        {menuRoutes.map(route =>
          'routes' in route ? (
            <SidebarGroup key={route.id}>
              <SidebarGroupLabel>{t(`heads.${route.id}`)}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Object.values(route.routes).map(subRoute => (
                    <AppSidebarMenuItem
                      key={subRoute.id}
                      id={subRoute.id}
                      path={subRoute.path()}
                      exact={subRoute.exact}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <SidebarMenu key={route.id}>
              <AppSidebarMenuItem id={route.id} path={route.path()} exact={false} />
            </SidebarMenu>
          ),
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

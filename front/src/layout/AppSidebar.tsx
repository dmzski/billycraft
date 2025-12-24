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
	Dropdown,
	Button,
} from "@billycraft/ui"
import { ROUTES, type RouteId } from "@/routes"
import { Link, useMatch } from "react-router-dom"
import { useI18n } from "@/i18n"
import { useOrganizationLogoQuery } from "@/queries/useOrganizationLogoQuery"
import { ChevronUpDownIcon } from "@heroicons/react/24/solid"
import { useOrganization } from "@/providers/OrganizationProvider"

const menuRoutes = [
	ROUTES.DASHBOARD,
	ROUTES.QUOTES,
	ROUTES.BILLS,
	ROUTES.CUSTOMERS,
	ROUTES.SUPPLIERS,
	ROUTES.PRODUCTS,
	ROUTES.ACCOUNTINGS,
	ROUTES.HISTORY,
] as const

type AppSidebarMenuItemsProps = {
	path: string
	id: RouteId
	exact: boolean
}
const AppSidebarMenuItem = ({ path, id, exact }: AppSidebarMenuItemsProps) => {
	const { t } = useI18n()
	const match = useMatch({
		path,
		end: exact,
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

export const AppSidebar = ({
	...props
}: React.ComponentProps<typeof Sidebar>) => {
	const { t } = useI18n()
	const { organization } = useOrganization()
	const { data: logo } = useOrganizationLogoQuery(organization?.id ?? "", {
		enabled: !!organization?.logo,
	})

	return (
		<Sidebar side="left" variant="floating" {...props}>
			<SidebarHeader>
				<div className="grid">
					<Dropdown
						disclosure={
							<Button className="h-auto truncate" variant="ghost">
								{logo ? (
									<Avatar
										className="object-contain"
										src={logo}
										alt={organization?.name}
									/>
								) : (
									<Avatar alt="?" />
								)}
								<span className="font-semibold truncate">
									{organization?.name}
								</span>
								<ChevronUpDownIcon />
							</Button>
						}
					>
						{({ close }) => (
							<Dropdown.Content className="w-full">
								<Dropdown.Button asChild>
									<Link
										onClick={close}
										to={ROUTES.ORGANIZATION.routes.SETTINGS.path()}
									>
										{t("heads.organization.settings")}
									</Link>
								</Dropdown.Button>
								<Dropdown.Button asChild>
									<Link
										onClick={close}
										to={ROUTES.ORGANIZATION.routes.USERS.path()}
									>
										{t("heads.organization.users")}
									</Link>
								</Dropdown.Button>
								<Dropdown.Button asChild>
									<Link
										onClick={close}
										to={ROUTES.ORGANIZATION.routes.CUSTOMIZATION.path()}
									>
										{t("heads.organization.customization")}
									</Link>
								</Dropdown.Button>
							</Dropdown.Content>
						)}
					</Dropdown>
				</div>
			</SidebarHeader>
			<SidebarContent className="overflow-y-auto">
				{/* We create a SidebarGroup for each parent. */}
				<SidebarGroup key="main">
					<SidebarGroupContent>
						{menuRoutes
							.filter(
								(route) =>
									("routes" in route && "INDEX" in route.routes) ||
									!("routes" in route),
							)
							.map((route) => (
								<SidebarMenu key={route.id}>
									<AppSidebarMenuItem
										id={route.id}
										path={route.path()}
										exact={false}
									/>
								</SidebarMenu>
							))}
					</SidebarGroupContent>
				</SidebarGroup>
				{menuRoutes
					.filter((route) => "routes" in route && !("INDEX" in route.routes))
					.map((route) =>
						"routes" in route ? (
							<SidebarGroup key={route.id}>
								<SidebarGroupLabel>{t(`heads.${route.id}`)}</SidebarGroupLabel>
								<SidebarGroupContent className="pl-2">
									<SidebarMenu>
										{Object.values(route.routes).map((subRoute) => (
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
						) : null,
					)}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}

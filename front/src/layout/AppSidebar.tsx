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
} from "@coco-ui/core";
import { useUser } from "@/providers/UserProvider";
import { ROUTES, RouteId } from "@/routes";
import { Link, useRouteMatch } from "react-router-dom";
import { useI18n } from "@/i18n";
import { useOrganizationLogoQuery } from "@/queries/useOrganizationLogoQuery";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";

const menuRoutes = [
	ROUTES.DASHBOARD,
	ROUTES.QUOTES,
	ROUTES.BILLS,
	ROUTES.CUSTOMERS,
	ROUTES.SUPPLIERS,
	ROUTES.PRODUCTS,
	ROUTES.ACCOUNTINGS,
	ROUTES.HISTORY,
] as const;

type AppSidebarMenuItemsProps = {
	path: string;
	id: RouteId;
	exact: boolean;
};
const AppSidebarMenuItem = ({ path, id, exact }: AppSidebarMenuItemsProps) => {
	const { t } = useI18n();
	const match = useRouteMatch({
		path,
		exact,
	});
	const { isMobile, setOpenMobile } = useSidebar();

	const onClickHandler = () => {
		if (isMobile) {
			setOpenMobile(false);
		}
	};

	return (
		<SidebarMenuItem>
			<SidebarMenuButton onClick={onClickHandler} asChild isActive={!!match}>
				<Link to={path}>{t(`heads.${id}`)}</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};

export const AppSidebar = ({
	...props
}: React.ComponentProps<typeof Sidebar>) => {
	const { t } = useI18n();
	const { organization } = useUser();
	const { data: logo } = useOrganizationLogoQuery(organization?.logo ?? "", {
		enabled: !!organization?.logo,
	});

	return (
		<Sidebar side="left" variant="floating" {...props}>
			<SidebarHeader>
				<div className="flex items-center">
					<Dropdown
						disclosure={
							<Button className="h-auto" variant="ghost">
								{logo ? (
									<Avatar
										className="object-contain"
										src={logo}
										alt={organization?.name}
									/>
								) : (
									<Avatar alt="?" />
								)}
								<span className="font-semibold">{organization?.name}</span>
								<ChevronUpDownIcon />
							</Button>
						}
					>
						{({ close }) => (
							<Dropdown.Content className="w-full">
								<Dropdown.Button asChild>
									<Link
										onClick={close}
										to={ROUTES.SETTINGS.routes.MY_COMPANY.path()}
									>
										{t("heads.settings.myOrganization")}
									</Link>
								</Dropdown.Button>
								<Dropdown.Button asChild>
									<Link
										onClick={close}
										to={ROUTES.SETTINGS.routes.USERS.path()}
									>
										{t("heads.settings.users")}
									</Link>
								</Dropdown.Button>
								<Dropdown.Button asChild>
									<Link
										onClick={close}
										to={ROUTES.SETTINGS.routes.BILL_CUSTOMIZATION.path()}
									>
										{t("heads.settings.billCustomization")}
									</Link>
								</Dropdown.Button>
								<Dropdown.Button asChild>
									<Link
										onClick={close}
										to={ROUTES.SETTINGS.routes.QUOTE_CUSTOMIZATION.path()}
									>
										{t("heads.settings.quoteCustomization")}
									</Link>
								</Dropdown.Button>
							</Dropdown.Content>
						)}
					</Dropdown>
				</div>
			</SidebarHeader>
			<SidebarContent className="overflow-y-auto">
				{/* We create a SidebarGroup for each parent. */}
				{menuRoutes.map((route) =>
					"routes" in route ? (
						<SidebarGroup key={route.id}>
							<SidebarGroupLabel>{t(`heads.${route.id}`)}</SidebarGroupLabel>
							<SidebarGroupContent>
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
					) : (
						<SidebarMenu key={route.id}>
							<AppSidebarMenuItem
								id={route.id}
								path={route.path()}
								exact={false}
							/>
						</SidebarMenu>
					),
				)}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
};

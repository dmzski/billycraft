import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/providers/AuthProvider";
import { useI18n } from "@/i18n";
import {
	ArrowRightStartOnRectangleIcon,
	ChevronDownIcon,
} from "@heroicons/react/24/solid";
import {
	Button,
	Dropdown,
	Link,
	SidebarProvider,
	SidebarTrigger,
} from "@coco-ui/core";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUser } from "@/providers/UserProvider";
import { SUPPORT_EMAIL } from "@/constants/global";

type LayoutProps = {
	children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
	const { logout } = useAuth();
	const { user } = useUser();
	const { t } = useI18n();

	return (
		<SidebarProvider>
			<AppSidebar />
			<div className="min-h-screen lg:w-screen overflow-x-auto flex overflow-hidden min-w-screen w-screen">
				<main className="w-full flex flex-col h-full gap-4">
					<div className="border-b p-2 flex justify-between items-center gap-4 flex-no-wrap">
						<SidebarTrigger />
						<div className="flex flex-no-wrap gap-4 items-center overflow-hidden">
							<Dropdown
								disclosure={
									<Button variant="ghost" size="sm">
										<span className="truncate max-w-52 md:max-w-lg">
											{user?.lastName || user?.firstName
												? `${user?.lastName} ${user?.firstName}`
												: (user?.email ?? "")}
										</span>
										<ChevronDownIcon />
									</Button>
								}
							>
								<Dropdown.Content className="w-full">
									<Dropdown.Button variant="destructive" onClick={logout}>
										<ArrowRightStartOnRectangleIcon />
										<span>{t("logout")}</span>
									</Dropdown.Button>
								</Dropdown.Content>
							</Dropdown>
							<ThemeToggle />
						</div>
					</div>
					<div className="p-4 flex-grow">{children}</div>
					<div className="items-center justify-center text-xs text-muted-foreground flex px-4 pb-4 gap-4 flex-row flex-wrap">
						<p>
							{t("supportPrefix")}
							<Link href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</Link>
						</p>
					</div>
				</main>
			</div>
		</SidebarProvider>
	);
};

export default Layout;

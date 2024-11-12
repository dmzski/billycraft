import { useI18n } from "@/i18n";
import { ROUTES } from "@/routes";
import { Redirect, Route, Switch } from "react-router-dom";
import { Users } from "./Users";
import { Invitations } from "./Invitations";
import { Tabs } from "@billycraft/ui";
import { RRTab } from "@/components/RRTab";

export const UsersAndInvitations = () => {
	const { scopedT } = useI18n();

	const pageT = scopedT("settings.users");

	return (
		<div className="flex flex-col gap-10">
			<h1 className="text-3xl">{pageT("title")}</h1>
			<div>
				<Tabs>
					<RRTab to={ROUTES.SETTINGS.routes.USERS.routes.USERS.path()}>
						{pageT("tabs.users")}
					</RRTab>
					<RRTab to={ROUTES.SETTINGS.routes.USERS.routes.INVITATIONS.path()}>
						{pageT("tabs.invitations")}
					</RRTab>
				</Tabs>
			</div>
			<Switch>
				<Route
					path={ROUTES.SETTINGS.routes.USERS.routes.USERS.path()}
					component={Users}
				/>
				<Route
					path={ROUTES.SETTINGS.routes.USERS.routes.INVITATIONS.path()}
					component={Invitations}
				/>
				<Route
					render={() => (
						<Redirect to={ROUTES.SETTINGS.routes.USERS.routes.USERS.path()} />
					)}
				/>
			</Switch>
		</div>
	);
};

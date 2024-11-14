import { Redirect, Route, Switch } from "react-router-dom";
import { UsersAndInvitations } from "./UsersAndInvitations/UsersAndInvitations";
import { ROUTES } from "@/routes";
import { Customization } from "./Customization/Customization";
import { Settings } from "./Settings/Settings";

export const Organization = () => (
	<Switch>
		<Route path={ROUTES.ORGANIZATION.routes.SETTINGS.path()} component={Settings} />
		<Route
			path={ROUTES.ORGANIZATION.routes.CUSTOMIZATION.path()}
			component={Customization}
		/>
		<Route
			path={ROUTES.ORGANIZATION.routes.USERS.path()}
			component={UsersAndInvitations}
		/>
		<Redirect to={ROUTES.ORGANIZATION.routes.SETTINGS.path()} />
	</Switch>
);

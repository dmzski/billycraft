import { Routes, Route, Navigate } from "react-router-dom";
import { UsersAndInvitations } from "./UsersAndInvitations/UsersAndInvitations";
import { ROUTES } from "@/routes";
import { Customization } from "./Customization/Customization";
import { Settings } from "./Settings/Settings";

export const Organization = () => (
	<Routes>
		<Route
			path={ROUTES.ORGANIZATION.routes.SETTINGS.route}
			element={<Settings />}
		/>
		<Route
			path={ROUTES.ORGANIZATION.routes.CUSTOMIZATION.route}
			element={<Customization />}
		/>
		<Route
			path={ROUTES.ORGANIZATION.routes.USERS.route}
			element={<UsersAndInvitations />}
		/>
		<Route
			path="*"
			element={
				<Navigate to={ROUTES.ORGANIZATION.routes.SETTINGS.route} replace />
			}
		/>
	</Routes>
);

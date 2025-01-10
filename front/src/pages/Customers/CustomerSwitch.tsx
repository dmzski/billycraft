import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@/routes";
import Customer from ".";
import { Overview } from "./Overview/Overview";
import { Create } from "./Create/Create";
import { Edit } from "./Edit/Edit";

const CustomerSwitch = () => (
	<Routes>
		<Route path={ROUTES.CUSTOMERS.routes.INDEX.route} element={<Customer />} />
		<Route path={ROUTES.CUSTOMERS.routes.EDIT.route} element={<Edit />} />
		<Route path={ROUTES.CUSTOMERS.routes.ADD.route} element={<Create />} />
		<Route
			path={ROUTES.CUSTOMERS.routes.OVERVIEW.route}
			element={<Overview />}
		/>
		<Route
			path="*"
			element={<Navigate to={ROUTES.CUSTOMERS.routes.INDEX.path()} replace />}
		/>
	</Routes>
);

export default CustomerSwitch;

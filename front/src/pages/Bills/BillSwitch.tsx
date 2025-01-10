import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@/routes";
import Bill from ".";
import { Edit } from "./Edit/Edit";
import { Create } from "./Create/Create";
import { Overview } from "./Overview/Overview";

const BillSwitch = () => (
	<Routes>
		<Route path={ROUTES.BILLS.routes.INDEX.route} element={<Bill />} />
		<Route path={ROUTES.BILLS.routes.EDIT.route} element={<Edit />} />
		<Route path={ROUTES.BILLS.routes.ADD.route} element={<Create />} />
		<Route path={ROUTES.BILLS.routes.OVERVIEW.route} element={<Overview />} />
		<Route
			path="*"
			element={<Navigate to={ROUTES.BILLS.routes.INDEX.path()} replace />}
		/>
	</Routes>
);

export default BillSwitch;

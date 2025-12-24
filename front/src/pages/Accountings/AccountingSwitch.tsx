import { Routes, Route, Navigate } from "react-router-dom"
import { ROUTES } from "@/routes"
import OutgoingsSwitch from "./Outgoings/OutgoingsSwitch"
import ReportsSwitch from "./Reports/ReportsSwitch"

const AccountingSwitch = () => (
	<Routes>
		<Route
			path={ROUTES.ACCOUNTINGS.routes.REPORTS.route}
			element={<ReportsSwitch />}
		/>
		<Route
			path={ROUTES.ACCOUNTINGS.routes.OUTGOINGS.route}
			element={<OutgoingsSwitch />}
		/>
		<Route
			path="*"
			element={
				<Navigate to={ROUTES.ACCOUNTINGS.routes.OUTGOINGS.path()} replace />
			}
		/>
	</Routes>
)

export default AccountingSwitch

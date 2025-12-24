import { Routes, Route } from "react-router-dom"
import { ROUTES } from "@/routes"
import Supplier from "."

const SupplierSwitch = () => (
	<Routes>
		<Route
			index
			path={ROUTES.SUPPLIERS.routes.INDEX.route}
			element={<Supplier />}
		/>
		<Route path={ROUTES.SUPPLIERS.routes.FORM.route} element={<Supplier />} />
	</Routes>
)

export default SupplierSwitch

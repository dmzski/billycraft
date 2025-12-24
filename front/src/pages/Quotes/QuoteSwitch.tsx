import { Route, Routes } from "react-router-dom"
import { ROUTES } from "@/routes"
import Quote from "."
import { Create } from "./Create/Create"
import { Edit } from "./Edit/Edit"
import { Overview } from "./Overview/Overview"

const QuoteSwitch = () => (
	<Routes>
		<Route index path={ROUTES.QUOTES.routes.INDEX.route} element={<Quote />} />
		<Route path={ROUTES.QUOTES.routes.EDIT.route} element={<Edit />} />
		<Route path={ROUTES.QUOTES.routes.ADD.route} element={<Create />} />
		<Route path={ROUTES.QUOTES.routes.OVERVIEW.route} element={<Overview />} />
	</Routes>
)

export default QuoteSwitch

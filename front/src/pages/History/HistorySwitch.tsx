import { Routes, Route, Navigate } from "react-router-dom"
import { HISTORY_ROUTES } from "./constant"
import TodoTab from "./TodoTab"

const HistorySwitch = () => (
	<Routes>
		<Route path={HISTORY_ROUTES.TODOS.route} element={<TodoTab />} />
		<Route path="*" element={<Navigate to={HISTORY_ROUTES.TODOS.route} />} />
	</Routes>
)

export default HistorySwitch

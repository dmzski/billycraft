import { Navigate, Routes, Route } from "react-router-dom"
import { ROUTES } from "@/routes"
import ListPage from "./ListPage"
import GroupsPage from "./GroupsPage"
import type { ReactNode } from "react"

const { routes } = ROUTES.PRODUCTS

type ProductLayoutProps = {
	children: ReactNode
}

const ProductsLayout = ({ children }: ProductLayoutProps) => {
	return <div className="flex flex-col gap-12">{children}</div>
}
const ProductsSwitch = () => (
	<Routes>
		<Route
			path={routes.LIST.route}
			element={
				<ProductsLayout>
					<ListPage />
				</ProductsLayout>
			}
		/>
		<Route
			path={routes.GROUPS.route}
			element={
				<ProductsLayout>
					<GroupsPage />
				</ProductsLayout>
			}
		/>
		<Route path="*" element={<Navigate to={routes.LIST.path()} />} />
	</Routes>
)

export default ProductsSwitch

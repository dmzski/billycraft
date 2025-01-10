import { Navigate, Route, Routes } from "react-router-dom"
import { ROUTES } from "@/routes"
import { useUser } from "@/providers/UserProvider"
import { useAuth } from "@/providers/AuthProvider"
import { PageLoader } from "@/components/PageLoader"
import Dashboard from "./Dashboard"
import Layout from "../layout/Layout"
import Onboarding from "./Onboarding/Onboarding"
import ProductsSwitch from "./Products/ProductsSwitch"
import History from "./History"
import AccountingSwitch from "./Accountings/AccountingSwitch"
import QuoteSwitch from "./Quotes/QuoteSwitch"
import BillSwitch from "./Bills/BillSwitch"
import CustomerSwitch from "./Customers/CustomerSwitch"
import SupplierSwitch from "./Suppliers/SupplierSwitch"
import { Login } from "./Auth/Login"
import { Register } from "./Auth/Register"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Account } from "./Account/Account"
import { Organization } from "./Organization/Organization"
import { useOrganization } from "@/providers/OrganizationProvider"
import type { ReactElement } from "react"

type PathComponentTuple = [string, () => ReactElement]

const UNAUTHENTIFIED_ROUTES: PathComponentTuple[] = [
	[ROUTES.LOGIN.route, Login],
	[ROUTES.REGISTER.route, Register],
]

const ONBOARDING_ROUTES: PathComponentTuple[] = [
	[ROUTES.ONBOARDING.route, Onboarding],
]

const APP_ROUTES: PathComponentTuple[] = [
	[ROUTES.ACCOUNTINGS.route, AccountingSwitch],
	[ROUTES.QUOTES.route, QuoteSwitch],
	[ROUTES.BILLS.route, BillSwitch],
	[ROUTES.CUSTOMERS.route, CustomerSwitch],
	[ROUTES.SUPPLIERS.route, SupplierSwitch],
	[ROUTES.DASHBOARD.route, Dashboard],
	[ROUTES.PRODUCTS.route, ProductsSwitch],
	[ROUTES.ORGANIZATION.route, Organization],
	[ROUTES.HISTORY.route, History],
	[ROUTES.ACCOUNT.route, Account],
]

export const MainSwitch = () => {
	const { user } = useUser()
	const { organization } = useOrganization()
	const { isAuthenticated, isInitializing } = useAuth()

	if (isInitializing) {
		return (
			<div className="flex justify-center items-center h-screen w-screen">
				<div className="w-1/2">
					<PageLoader />
				</div>
			</div>
		)
	}

	if (!isAuthenticated) {
		return (
			<Routes>
				{UNAUTHENTIFIED_ROUTES.map(([path, RouteComponent]) => (
					<Route
						key={path}
						path={path}
						element={
							<ErrorBoundary>
								<RouteComponent />
							</ErrorBoundary>
						}
					/>
				))}
				<Route path="*" element={<Navigate to={ROUTES.LOGIN.path()} />} />
			</Routes>
		)
	}

	if (!user || (user.companyId && !organization)) {
		return (
			<div className="flex justify-center items-center h-screen w-screen">
				<div className="w-1/2">
					<PageLoader />
				</div>
			</div>
		)
	}

	if (user && user.companyId === null) {
		return (
			<Routes>
				{ONBOARDING_ROUTES.map(([path, RouteComponent]) => (
					<Route
						key={path}
						path={path}
						element={
							<ErrorBoundary>
								<RouteComponent />
							</ErrorBoundary>
						}
					/>
				))}
				<Route path="*" element={<Navigate to={ROUTES.ONBOARDING.path()} />} />
			</Routes>
		)
	}
	return (
		<Layout>
			<ErrorBoundary>
				<Routes>
					{APP_ROUTES.map(([path, RouteComponent]) => (
						<Route key={path} path={path} element={<RouteComponent />} />
					))}
					<Route element={<Navigate to={ROUTES.DASHBOARD.path()} />} />
				</Routes>
			</ErrorBoundary>
		</Layout>
	)
}

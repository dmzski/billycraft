import { Route, Routes, Navigate } from "react-router-dom"
import { ROUTES } from "@/routes"
import FormPage from "./FormPage"
import Details from "./Details"
import ListPage from "./ListPage"
import Overview from "./Overview"
import { useI18n } from "@/i18n"
import type { ReactNode } from "react"
import { Tabs } from "@billycraft/ui"
import { RRTab } from "@/components/RRTab"

const { routes } = ROUTES.ACCOUNTINGS.routes.OUTGOINGS

type OutgoingLayoutProps = {
	children: ReactNode
}

const OutgoingLayout = ({ children }: OutgoingLayoutProps) => {
	const { t } = useI18n()

	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-5">
				<h1 className="text-3xl mb-4">{t("accounting.outgoings.title")}</h1>
				<div>
					<Tabs>
						<RRTab to={routes.OVERVIEW.path()}>
							{t("accounting.outgoings.links.overview")}
						</RRTab>
						<RRTab to={routes.LIST.path()}>
							{t("accounting.outgoings.links.list")}
						</RRTab>
					</Tabs>
				</div>
			</div>
			{children}
		</div>
	)
}
const OutgoingsSwitch = () => (
	<Routes>
		<Route
			path={routes.OVERVIEW.route}
			element={
				<OutgoingLayout>
					<Overview />
				</OutgoingLayout>
			}
		/>
		<Route
			path={routes.LIST.route}
			element={
				<OutgoingLayout>
					<ListPage />
				</OutgoingLayout>
			}
		/>
		<Route path={routes.FORM.route} element={<FormPage />} />
		<Route path={routes.DETAILS.route} element={<Details />} />
		<Route
			path="*"
			element={<Navigate to={routes.OVERVIEW.path()} replace />}
		/>
	</Routes>
)

export default OutgoingsSwitch

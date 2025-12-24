import { Routes, Route, Navigate } from "react-router-dom"
import { useI18n } from "@/i18n"
import { ROUTES } from "@/routes"
import { Users } from "./Users"
import { Invitations } from "./Invitations"
import { Tabs } from "@billycraft/ui"
import { RRTab } from "@/components/RRTab"

export const UsersAndInvitations = () => {
	const { scopedT } = useI18n()

	const pageT = scopedT("settings.users")

	return (
		<div className="flex flex-col gap-10">
			<h1 className="text-3xl font-semibold">{pageT("title")}</h1>
			<div>
				<Tabs>
					<RRTab to={ROUTES.ORGANIZATION.routes.USERS.routes.USERS.path()}>
						{pageT("tabs.users")}
					</RRTab>
					<RRTab
						to={ROUTES.ORGANIZATION.routes.USERS.routes.INVITATIONS.path()}
					>
						{pageT("tabs.invitations")}
					</RRTab>
				</Tabs>
			</div>
			<Routes>
				<Route
					path={ROUTES.ORGANIZATION.routes.USERS.routes.USERS.path()}
					element={<Users />}
				/>
				<Route
					path={ROUTES.ORGANIZATION.routes.USERS.routes.INVITATIONS.path()}
					element={<Invitations />}
				/>
				<Route
					path="*"
					element={
						<Navigate
							to={ROUTES.ORGANIZATION.routes.USERS.routes.USERS.path()}
							replace
						/>
					}
				/>
			</Routes>
		</div>
	)
}

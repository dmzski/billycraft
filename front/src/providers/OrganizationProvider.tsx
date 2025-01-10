import { useMyOrganizationQuery } from "@/queries/useMyOrganizationQuery"
import type { OrganizationResponse } from "@/sdk"
import { createContext, type ReactNode, useContext, useMemo } from "react"
import { useUser } from "./UserProvider"

type OrganizationContextValue = {
	organization?: OrganizationResponse
	isLoading: boolean
	reload: () => Promise<void>
}
const OrganizationContext = createContext<OrganizationContextValue>({
	organization: undefined,
	isLoading: false,
	reload: () => Promise.resolve(),
})

type OrganizationProviderProps = {
	children: ReactNode
}

export const OrganizationProvider = ({
	children,
}: OrganizationProviderProps) => {
	const { user } = useUser()
	const {
		reload,
		data: organization,
		isLoading,
	} = useMyOrganizationQuery({ enabled: !!user?.companyId })

	const data = useMemo(
		() => ({
			reload,
			organization,
			isLoading,
		}),
		[reload, organization, isLoading],
	)

	return (
		<OrganizationContext.Provider value={data}>
			{children}
		</OrganizationContext.Provider>
	)
}

export const useOrganization = () => {
	const context = useContext(OrganizationContext)

	if (!context) {
		throw new Error("Cannot use useOrganization outside OrganizationProvider")
	}

	return context
}

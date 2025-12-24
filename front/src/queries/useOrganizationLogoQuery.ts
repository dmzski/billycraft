import { OrganizationService } from "@/sdk"
import {
	type UseDataLoaderConfig,
	useDataLoader,
} from "@scaleway/use-dataloader"

export const useOrganizationLogoQuery = (
	organizationId: string,
	dataloaderConfig?: UseDataLoaderConfig<string, Error>,
) => {
	const key = ["organziation", "logo", organizationId]

	return useDataLoader(
		key,
		async () => {
			const res = await OrganizationService.getOrganizationByIdLogo({
				path: { id: organizationId },
			}).then(({ data }) => data)
			if (res) {
				const reader = new FileReader()
				return new Promise<string>((resolve, reject) => {
					reader.onloadend = () => resolve(reader.result as string)
					reader.onerror = reject
          reader.readAsDataURL(new Blob([res]))
				})
			}

			return undefined
		},
		dataloaderConfig,
	)
}

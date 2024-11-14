import { CompanyService, type OrganizationResponse } from "@/sdk";
import { useDataLoader } from "@scaleway/use-dataloader";

type DataLoaderOptions = Parameters<
	typeof useDataLoader<OrganizationResponse>
>[2];

export const useMyOrganizationQuery = (options?: DataLoaderOptions) => {
	const key = ["my-organization"];

	return useDataLoader(
		key,
		() => CompanyService.getCompanyMine().then(({ data }) => data),
		options,
	);
};

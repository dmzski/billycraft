import { CompanyApi } from "@/api/CompanyApi"
import Company from "@/models/Company"
import { useDataLoader } from "@scaleway/use-dataloader"

type DataLoaderOptions = Parameters<typeof useDataLoader<Company>>[2]

export const useMyOrganizationQuery = (options: DataLoaderOptions) => {
  const key = ['my-organization']

  return useDataLoader(key, () => CompanyApi.getMine(), options)
}

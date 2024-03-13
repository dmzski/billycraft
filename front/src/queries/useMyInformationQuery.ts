import { UserApi } from "@/api/UserApi"
import User from "@/models/User"
import { useDataLoader } from "@scaleway/use-dataloader"

type DataLoaderOptions = Parameters<typeof useDataLoader<User>>[2]
export const useMyInformationQuery = (options: DataLoaderOptions) => {
  const key = ['my-information']

  return useDataLoader(key, () => UserApi.getMyInformation(), options)
}

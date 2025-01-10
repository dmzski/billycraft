import { type UserResponse, UsersService } from "@/sdk"
import { useDataLoader } from "@scaleway/use-dataloader"

type DataLoaderOptions = Parameters<typeof useDataLoader<UserResponse>>[2]
export const useMyInformationQuery = (options: DataLoaderOptions) => {
	const key = ["my-information"]

	return useDataLoader(
		key,
		() =>
			UsersService.getUsersMe({ throwOnError: true }).then(({ data }) => data),
		options,
	)
}

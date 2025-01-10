import { type UserResponse, UsersService } from "@/sdk"
import {
	type UseDataLoaderConfig,
	useDataLoader,
} from "@scaleway/use-dataloader"

export const useAllUsersQuery = (
	config?: UseDataLoaderConfig<UserResponse[], Error>,
) => {
	const key = ["users", "all"]

	return useDataLoader(
		key,
		() => UsersService.getUsers().then(({ data }) => data),
		config,
	)
}

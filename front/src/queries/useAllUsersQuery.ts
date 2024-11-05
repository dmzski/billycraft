import { UserApi } from "@/api/UserApi";
import { User } from "@/models/User";
import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useAllUsersQuery = (
	config?: UseDataLoaderConfig<User[], Error>,
) => {
	const key = ["users", "all"];

	return useDataLoader(key, () => UserApi.findAll(), config);
};

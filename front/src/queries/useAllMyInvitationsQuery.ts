import { InvitationsService, type MyInvitationResponse } from "@/sdk";
import { type UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useAllMyInvitationsQuery = (
	config?: UseDataLoaderConfig<MyInvitationResponse[], Error>,
) => {
	const key = ["my-invitations", "all"];

	return useDataLoader(
		key,
		() =>
			InvitationsService.getInvitationsMinePending().then(({ data }) => data),
		config,
	);
};

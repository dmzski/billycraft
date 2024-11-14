import {
	type GetInvitationsData,
	type InvitationResponse,
	InvitationsService,
} from "@/sdk";
import {
	type UseDataLoaderConfig,
	useDataLoader,
} from "@scaleway/use-dataloader";

export const useAllInvitationsQuery = (
	params?: GetInvitationsData["query"],
	config?: UseDataLoaderConfig<InvitationResponse[], Error>,
) => {
	const key = [
		"invitations",
		"all",
		Object.entries(params ?? {}).flat(2),
	].flat();

	return useDataLoader(
		key,
		() =>
			InvitationsService.getInvitations({ query: params }).then(
				({ data }) => data,
			),
		config,
	);
};

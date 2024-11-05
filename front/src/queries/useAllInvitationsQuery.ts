import { InvitationApi } from "@/api/InvitationApi";
import {
	InvitationFindAllParams,
	InvitationResponse,
} from "@/models/dtos/Invitation";
import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useAllInvitationsQuery = (
	params?: InvitationFindAllParams,
	config?: UseDataLoaderConfig<InvitationResponse[], Error>,
) => {
	const key = [
		"invitations",
		"all",
		Object.entries(params ?? {}).flat(2),
	].flat();

	return useDataLoader(key, () => InvitationApi.findAll(params), config);
};

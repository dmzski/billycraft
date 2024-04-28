import { InvitationApi } from "@/api/InvitationApi";
import { MyInvitationResponse } from "@/models/dtos/Invitation";
import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useAllMyInvitationsQuery = (config?: UseDataLoaderConfig<MyInvitationResponse[], Error>) => {
  const key = [
    "my-invitations",
    "all"
  ]

  return useDataLoader(key, () => InvitationApi.findMinePending(), config)

}

import { OutgoingApi } from "@/api/OutgoingApi"
import { OutgoingResponse } from "@/models/Outgoing"
import { useDataLoader } from "@scaleway/use-dataloader"

type DataLoaderConfig = Parameters<typeof useDataLoader<OutgoingResponse>>[2]

export const useOutgoingByIdQuery = (id: Parameters<typeof OutgoingApi.findOneById>[0], config?: DataLoaderConfig) => {
  const key = ['outgoings', 'by-id', id].flat()



  return useDataLoader(key, () => OutgoingApi.findOneById(id), config)
}

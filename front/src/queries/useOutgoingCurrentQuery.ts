import { OutgoingApi } from "@/api/OutgoingApi"
import { OutgoingResponse } from "@/models/Outgoing"
import { useDataLoader } from "@scaleway/use-dataloader"

type DataLoaderConfig = Parameters<typeof useDataLoader<OutgoingResponse>>[2]

export const useOutgoingCurrentQuery = (config?: DataLoaderConfig) => {
  const key = ['outgoings', 'current'].flat()



  return useDataLoader(key, () => OutgoingApi.findCurrent(), config)
}

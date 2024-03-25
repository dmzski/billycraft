import { ReportApi } from "@/api/ReportApi"
import { ReportResponse } from "@/models/Report"
import { useDataLoader } from "@scaleway/use-dataloader"

type DataLoaderConfig = Parameters<typeof useDataLoader<ReportResponse[]>>[2]

export const useAllReportsQuery = (config?: DataLoaderConfig) => {
  const key = ['reports', 'all'].flat()



  return useDataLoader(key, () => ReportApi.findAll(), config)
}

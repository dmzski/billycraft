import { ReportApi } from "@/api/ReportApi"
import { ReportResponse } from "@/models/Report"
import { useDataLoader } from "@scaleway/use-dataloader"

type DataLoaderConfig = Parameters<typeof useDataLoader<ReportResponse>>[2]

export const useReportByIdQuery = (id: Parameters<typeof ReportApi.findById>[0], config?: DataLoaderConfig) => {
  const key = ['reports', 'by-id', id].flat()



  return useDataLoader(key, () => ReportApi.findById(id), config)
}

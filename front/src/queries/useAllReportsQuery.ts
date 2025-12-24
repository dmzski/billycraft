import { type ReportResponse, ReportsService } from "@/sdk"
import { useDataLoader } from "@scaleway/use-dataloader"

type DataLoaderConfig = Parameters<typeof useDataLoader<ReportResponse[]>>[2]

export const useAllReportsQuery = (config?: DataLoaderConfig) => {
	const key = ["reports", "all"].flat()

	return useDataLoader(
		key,
		() => ReportsService.getReports().then(({ data }) => data),
		config,
	)
}

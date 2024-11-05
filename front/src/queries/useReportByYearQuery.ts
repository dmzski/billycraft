import { ReportApi } from "@/api/ReportApi";
import { ReportResponse } from "@/models/Report";
import { useDataLoader } from "@scaleway/use-dataloader";

type DataLoaderConfig = Parameters<typeof useDataLoader<ReportResponse>>[2];

export const useReportByYearQuery = (
	date: Parameters<typeof ReportApi.getYearReport>[0],
	config?: DataLoaderConfig,
) => {
	const key = ["reports", "by-year", date].flat();

	return useDataLoader(key, () => ReportApi.getYearReport(date), config);
};

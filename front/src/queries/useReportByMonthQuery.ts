import { ReportApi } from "@/api/ReportApi";
import { ReportResponse } from "@/models/Report";
import { useDataLoader } from "@scaleway/use-dataloader";

type DataLoaderConfig = Parameters<typeof useDataLoader<ReportResponse>>[2];

export const useReportByMonthQuery = (
	date: Parameters<typeof ReportApi.getMonthReport>[0],
	config?: DataLoaderConfig,
) => {
	const key = ["reports", "by-month", date].flat();

	return useDataLoader(key, () => ReportApi.getMonthReport(date), config);
};

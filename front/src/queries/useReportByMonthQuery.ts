import {
	type GetReportsMonthData,
	type ReportResponse,
	ReportsService,
} from "@/sdk";
import { useDataLoader } from "@scaleway/use-dataloader";

type DataLoaderConfig = Parameters<typeof useDataLoader<ReportResponse>>[2];

export const useReportByMonthQuery = (
	date: NonNullable<GetReportsMonthData["query"]["date"]>,
	config?: DataLoaderConfig,
) => {
	const key = ["reports", "by-month", date].flat();

	return useDataLoader(
		key,
		() => ReportsService.getReportsMonth({ query: { date } }).then(({data}) => data),
		config,
	);
};

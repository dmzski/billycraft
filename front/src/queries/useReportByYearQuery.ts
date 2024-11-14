import { type GetReportsYearData, type ReportResponse, ReportsService } from "@/sdk";
import { useDataLoader } from "@scaleway/use-dataloader";

type DataLoaderConfig = Parameters<typeof useDataLoader<ReportResponse>>[2];

export const useReportByYearQuery = (
	date: GetReportsYearData["query"]["date"],
	config?: DataLoaderConfig,
) => {
	const key = ["reports", "by-year", date].flat();

	return useDataLoader(
		key,
		() =>
			ReportsService.getReportsYear({ query: { date } }).then(
				({ data }) => data,
			),
		config,
	);
};

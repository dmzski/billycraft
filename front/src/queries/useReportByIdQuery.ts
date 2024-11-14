import {
	type GetReportsByIdData,
	type ReportResponse,
	ReportsService,
} from "@/sdk";
import { useDataLoader } from "@scaleway/use-dataloader";

type DataLoaderConfig = Parameters<typeof useDataLoader<ReportResponse>>[2];

export const useReportByIdQuery = (
	id: GetReportsByIdData["path"]["id"],
	config?: DataLoaderConfig,
) => {
	const key = ["reports", "by-id", id].flat();

	return useDataLoader(
		key,
		() =>
			ReportsService.getReportsById({ path: { id } }).then(({ data }) => data),
		config,
	);
};

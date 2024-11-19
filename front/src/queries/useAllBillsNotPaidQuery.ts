import { BillsService } from "@/sdk";
import { useDataLoader } from "@scaleway/use-dataloader";

export const useAllBillsNotPaidQuery = () => {
	const key = ["bills", "not-paid"];

	return useDataLoader(key, () =>
		BillsService.getBills({
			query: { status: ["SENT"] },
		}).then(({ data }) => data),
	);
};

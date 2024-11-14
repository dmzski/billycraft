import {
	type BillCustomizationResponse,
	BillCustomizationService,
} from "@/sdk";
import {
	type UseDataLoaderConfig,
	useDataLoader,
} from "@scaleway/use-dataloader";

export const useMyBillCustomizationQuery = (
	config?: UseDataLoaderConfig<BillCustomizationResponse, Error>,
) => {
	const key = ["bill-customization", "mine"];

	return useDataLoader(
		key,
		() =>
			BillCustomizationService.getBillCustomizationMine().then(
				({ data }) => data,
			),
		config,
	);
};

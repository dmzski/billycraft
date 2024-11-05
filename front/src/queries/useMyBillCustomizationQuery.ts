import { BillCustomizationApi } from "@/api/BillCustomizationApi";
import BillCustomization from "@/models/BillCustomization";
import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useMyBillCustomizationQuery = (
	config?: UseDataLoaderConfig<BillCustomization, Error>,
) => {
	const key = ["bill-customization", "mine"];

	return useDataLoader(key, () => BillCustomizationApi.findMine(), config);
};

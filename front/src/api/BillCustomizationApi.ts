import { API_URL } from "@/constants/global";
import BillCustomization from "@/models/BillCustomization";
import { HttpClient } from "./HttpClient";

export const BILL_CUSTOMIZATION_URL = `${API_URL}/bill-customization`;

export const BillCustomizationApi = {
	findMine: () =>
		HttpClient.GET<BillCustomization>(`${BILL_CUSTOMIZATION_URL}/mine`),
	updateMine: (customization: BillCustomization) =>
		customization.id
			? HttpClient.PATCH<BillCustomization>(
					`${BILL_CUSTOMIZATION_URL}/${customization.id}`,
					customization,
				)
			: HttpClient.POST<BillCustomization>(
					`${BILL_CUSTOMIZATION_URL}`,
					customization,
				),
};

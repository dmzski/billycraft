import { API_URL } from "constants/global";
import BillCustomization from "models/BillCustomization";
import { HttpClient } from "./HttpClient";

export const BILL_CUSTOMIZATION_URL = API_URL + "/bill-customization";

export const BillCustomizationApi = {
  findMine: (): Promise<any> =>
    HttpClient.GET<any>(`${BILL_CUSTOMIZATION_URL}/mine`),
  updateMine: (customization: BillCustomization): Promise<BillCustomization> =>
    HttpClient.POST(
      `${BILL_CUSTOMIZATION_URL}/${customization.id}`,
      customization
    ),
};

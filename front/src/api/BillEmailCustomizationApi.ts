import { API_URL } from "constants/global";
import BillEmailCustomization from "models/BillEmailCustomization";
import { HttpClient } from "./HttpClient";

export const BILL_EMAIL_CUSTOMIZATION_URL =
  API_URL + "/bill-email-customization";

export const BillEmailCustomizationApi = {
  findMine: (): Promise<any> =>
    HttpClient.GET<any>(`${BILL_EMAIL_CUSTOMIZATION_URL}/mine`),
  updateMine: (
    customization: BillEmailCustomization
  ): Promise<BillEmailCustomization> =>
    HttpClient.POST(
      `${BILL_EMAIL_CUSTOMIZATION_URL}/${customization.id}`,
      customization
    ),
};

import { API_URL } from "constants/global";
import QuoteCustomization from "models/QuoteCustomization";
import { HttpClient } from "./HttpClient";

export const QUOTE_CUSTOMIZATION_URL = API_URL + "/quote-customization";

export const QuoteCustomizationApi = {
  findMine: (): Promise<any> =>
    HttpClient.GET<any>(`${QUOTE_CUSTOMIZATION_URL}/mine`),
  updateMine: (
    customization: QuoteCustomization
  ): Promise<QuoteCustomization> =>
    HttpClient.POST(
      `${QUOTE_CUSTOMIZATION_URL}/${customization.id}`,
      customization
    ),
};

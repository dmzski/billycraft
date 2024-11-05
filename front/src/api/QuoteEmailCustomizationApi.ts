import { API_URL } from "@/constants/global";
import QuoteEmailCustomization from "@/models/QuoteEmailCustomization";
import { HttpClient } from "./HttpClient";

export const QUOTE_EMAIL_CUSTOMIZATION_URL = `${API_URL}/quote-email-customization`;

export const QuoteEmailCustomizationApi = {
	findMine: (): Promise<QuoteEmailCustomization> =>
		HttpClient.GET(`${QUOTE_EMAIL_CUSTOMIZATION_URL}/mine`),
	updateMine: (
		customization: QuoteEmailCustomization,
	): Promise<QuoteEmailCustomization> =>
		!customization.id
			? HttpClient.POST(`${QUOTE_EMAIL_CUSTOMIZATION_URL}`, customization)
			: HttpClient.PATCH(
					`${QUOTE_EMAIL_CUSTOMIZATION_URL}/${customization.id}`,
					customization,
				),
};

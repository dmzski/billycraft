import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const EMAIL_URL = API_URL + "/emails";

export const EmailApi = {
  sendQuote: async (quoteId: string): Promise<string> =>
    HttpClient.POST<string>(
      `${EMAIL_URL}/quotes/send?id=${quoteId}`,
      {}
    ).then((res: any) => res.text()),
  sendBill: async (billId: string): Promise<any> =>
    HttpClient.POST(
      `${EMAIL_URL}/bills/send?id=${billId}`,
      {}
    ).then((res: any) => res.text()),
};

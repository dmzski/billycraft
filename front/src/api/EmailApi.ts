import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const EMAIL_URL = API_URL + "/emails";

export const EmailApi = {
  sendQuote: async (quoteId: string): Promise<any> => {
    const { query, abort } = HttpClient.POST(`${EMAIL_URL}/quotes/send?id=${quoteId}`, {});
    const promise = query.then((res: any) => {
      if (res.status === 200) {
        return res.text();
      } else {
        throw res;
      }
    });

    promise.cancel = abort;

    return promise;
  },
  sendBill: async (billId: string): Promise<any> => {
    const { query, abort } = HttpClient.POST(`${EMAIL_URL}/bills/send?id=${billId}`, {});
    const promise = query.then((res: any) => {
      if (res.status === 200) {
        return res.text();
      } else {
        throw res;
      }
    });

    promise.cancel = abort;

    return promise;
  },
};

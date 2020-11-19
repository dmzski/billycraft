import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const EMAIL_URL = API_URL + "/emails";

export const EmailApi = {
  sendQuote: async (quoteId: String) => {
    const { query, abort } = HttpClient.POST(`${EMAIL_URL}/quotes/send?id=${quoteId}`, {});
    let promise = query.then((res: any) => {
      if (res.status === 200) {
        return res.text();
      } else {
        throw res;
      }
    });

    promise.cancel = abort;

    return promise;
  },
  sendBill: async (billId: String) => {
    const { query, abort } = HttpClient.POST(`${EMAIL_URL}/bills/send?id=${billId}`, {});
    let promise = query.then((res: any) => {
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

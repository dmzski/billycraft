import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const PDF_URL = API_URL + "/pdfs";

export const PdfApi = {
  getQuotePdf: async (quoteId: string) => {
    const { query, abort } = HttpClient.GET(`${PDF_URL}/quote/${quoteId}`);
    let promise = query
      .then((res: any) => {
        if (res.status === 200) {
          return res.blob();
        } else {
          throw res;
        }
      })
      .then((blob: any) => blob);

    promise.cancel = abort;

    return promise;
  },
  getBillPdf: async (billId: string) => {
    const { query, abort } = HttpClient.GET(`${PDF_URL}/bill/${billId}`);
    let promise = query
      .then((res: any) => {
        if (res.status === 200) {
          return res.blob();
        } else {
          throw res;
        }
      })
      .then((blob: any) => blob);

    promise.cancel = abort;

    return promise;
  },
};

import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const PDF_URL = API_URL + "/pdfs";

export const PdfApi = {
  getPdf: async (quoteId: string) => {
    const { query, abort } = HttpClient.GET(`${PDF_URL}/${quoteId}`);
    let promise = query.then((res: any) => res.blob()).then((blob: any) => blob);

    promise.cancel = abort;

    return promise;
  },
};

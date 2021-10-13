import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const PDF_URL = API_URL + "/pdfs";

export const PdfApi = {
  getQuotePdf: async (quoteId: string): Promise<Blob> =>
    HttpClient.GET(`${PDF_URL}/quote/${quoteId}`)
      .then((res: Request) => res.blob())
      .then((blob: Blob) => blob),
  getBillPdf: async (billId: string): Promise<Blob> =>
    HttpClient.GET(`${PDF_URL}/bill/${billId}`)
      .then((res: Request) => res.blob())
      .then((blob: Blob) => blob),
};

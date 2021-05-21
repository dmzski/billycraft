import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const COMPANY_URL = API_URL + "/company";

export const CompanyApi = {
  uploadLogo: async (file: File): Promise<any> => {
    const { query, abort } = HttpClient.POST(`${COMPANY_URL}/upload-logo`, file, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    const promise = query
      .then((res: any) => {
        if (res.status === 200) {
          return res.text();
        } else {
          throw res;
        }
      })
      .then((url: any) => url);

    promise.cancel = abort;

    return promise;
  },
};

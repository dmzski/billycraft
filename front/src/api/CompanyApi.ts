import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const COMPANY_URL = API_URL + "/company";

export const CompanyApi = {
  uploadLogo: async (file: File) => {
    const { query, abort } = HttpClient.POST(`${COMPANY_URL}/upload-logo`, file, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    let promise = query
      .then((res: any) => {
        console.log("Response", res);
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

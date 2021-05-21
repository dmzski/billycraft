import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const PRODUCT_URL = API_URL + "/products";

export const ProductApi = {
  delete: async (id: number): Promise<any> => {
    const { query, abort } = HttpClient.DELETE(`${PRODUCT_URL}/${id}`, {});
    const promise = query.then((res: any) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw res;
      }
    });

    promise.cancel = abort;

    return promise;
  },
};
